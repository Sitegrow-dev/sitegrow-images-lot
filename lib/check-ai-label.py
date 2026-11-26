#!/usr/bin/env python3
"""Checks that an image (WebP, JPEG, PNG, AVIF) no longer carries an AI label.

Reads the file structure instead of searching words in the bytes:
compressed image data sometimes contains "jumb" or "Dall" by chance.
Output: "OK" (exit 0) or the list of labels found (exit 1).
"""
import struct
import sys

MOTS = (b'c2pa', b'jumbf', b'trainedAlgorithmicMedia', b'OpenAI', b'ChatGPT', b'DALL', b'contentauth', b'cai:')


def mots(meta):
    return [m.decode() for m in MOTS if m in meta]


def webp(b):
    pb, i = [], 12
    while i + 8 <= len(b):
        t, l = b[i:i + 4], struct.unpack('<I', b[i + 4:i + 8])[0]
        if t not in (b'VP8 ', b'VP8L', b'VP8X', b'ALPH', b'ICCP', b'ANIM', b'ANMF'):
            pb.append('chunk ' + t.decode('latin1').strip())
            pb += mots(b[i + 8:i + 8 + l])
        i += 8 + l + (l & 1)
    return pb


def jpeg(b):
    pb, i = [], 2
    while i + 4 <= len(b) and b[i] == 0xFF:
        m = b[i + 1]
        if m == 0xDA:  # start of image data
            break
        l = struct.unpack('>H', b[i + 2:i + 4])[0]
        seg = b[i + 4:i + 2 + l]
        if m == 0xEB:  # APP11 = JUMBF / C2PA
            pb.append('APP11 segment (C2PA)')
        if 0xE0 <= m <= 0xEF or m == 0xFE:
            pb += mots(seg)
        i += 2 + l
    return pb


def png(b):
    pb, i = [], 8
    while i + 8 <= len(b):
        l, t = struct.unpack('>I', b[i:i + 4])[0], b[i + 4:i + 8]
        if t in (b'caBX', b'jumb'):
            pb.append('chunk ' + t.decode())
        if t in (b'tEXt', b'iTXt', b'zTXt', b'eXIf', b'caBX'):
            pb += mots(b[i + 8:i + 8 + l])
        i += 12 + l
    return pb


def isobmff(b):  # AVIF / HEIF : boites de premier niveau et contenu de « meta »
    pb, i = [], 0
    while i + 8 <= len(b):
        l, t = struct.unpack('>I', b[i:i + 4])[0], b[i + 4:i + 8]
        if l < 8:
            break
        if t in (b'uuid', b'jumb', b'c2pa'):
            pb.append('box ' + t.decode('latin1'))
        if t == b'meta':
            pb += mots(b[i:i + l])
        i += l
    return pb


def verifier(chemin):
    b = open(chemin, 'rb').read()
    if b[:4] == b'RIFF' and b[8:12] == b'WEBP':
        return webp(b)
    if b[:2] == b'\xff\xd8':
        return jpeg(b)
    if b[:8] == b'\x89PNG\r\n\x1a\n':
        return png(b)
    if b[4:8] == b'ftyp':
        return isobmff(b)
    return ['unknown format']


if __name__ == '__main__':
    code = 0
    for f in sys.argv[1:]:
        pb = sorted(set(verifier(f)))
        print(f'{f} : ' + ('OK' if not pb else 'AI LABEL: ' + ', '.join(pb)))
        code |= bool(pb)
    sys.exit(code)
