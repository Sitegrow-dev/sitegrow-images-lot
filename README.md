# sitegrow-images-lot

**English** · [Français](#français)

Creates a batch of realistic photos for a client site, in one command: same setting on every photo, several camera angles, 4:3 WebP with SEO names, AI label removed, draft alt texts and a contact sheet for review.

First used on handsoffmyhobby.org (78 photos, 26 pages). Requested by Sourav, built by Remi's terminal 2, November 2026.

## What is automated
For each photo of the list:
1. **Generate** it with Codex (ChatGPT account): shared setting + subject + angle.
2. **Clean** it with Ralph's tool (https://sitegrow-images.vercel.app/), which removes the "made with AI" label.
3. **Check** that no AI label is left (C2PA / Content Credentials, OpenAI or ChatGPT metadata). The check reads the file structure, so there are no false alarms.
4. **Save** it as WebP with its SEO file name (4:3, 1448 x 1086 by default).
5. **Draft alt texts** in the requested languages: Codex looks at the finished photo.
6. **Build a contact sheet** of the whole batch for review.

## What stays human (on purpose)
1. Review the contact sheet: anatomy, colors, pose. Regenerate what is wrong with `--redo <name>`.
2. Check each alt text while looking at the photo (a line starting with CHECK means the photo does not match its subject).
3. Add the photos to the site (every site is different).

Rule: always describe the subject in text. Never start from someone else's photo (copyright).

## Requirements
- Linux or macOS with `bash`, `python3`, `node` 18+ and `flock` (on macOS: `brew install flock`).
- **Codex CLI** logged in to the team's ChatGPT account (`codex login`, ask Jordan).
- Outside Sitegrow's dev server, the scripts open Ralph's tool with Playwright Chromium: run `npm install` once. The browser profile is kept in `~/.sitegrow-images-lot/profile`; if the tool ever asks for a team password, run one batch with `HEADED=1` to type it once.

## Install
```bash
git clone git@github.com:Sitegrow-dev/sitegrow-images-lot.git
cd sitegrow-images-lot
npm install          # not needed on Sitegrow's dev server (uses the shared co-browser)
./install.sh         # links images-lot, image-codex and image-ralph into ~/.local/bin
```

## Use
Create a folder with two files:

- `decor.txt`: the shared setting in English, or the name of a saved setting from `decors/` (e.g. `aquarium`).
- `photos.tsv`: one line per photo, tab-separated: `seo-name <TAB> subject <TAB> camera angle (optional)`. For 2 or 3 angles of one subject, write 2 or 3 lines with different angles.

```
ember-tetras-school	a school of ember tetras (Hyphessobrycon amandae), translucent orange-red	side view in front of the driftwood
ember-tetra-macro	one ember tetra (Hyphessobrycon amandae), translucent orange-red	macro side profile
```

Then:
```bash
images-lot <folder> --alts en,fr      # about 1.5 minutes per photo
images-lot <folder> --redo <name>     # regenerate one rejected photo
images-lot <folder> --size blog       # 1200 x 800 instead of 4:3
images-lot <folder> --sheet           # rebuild only the contact sheet
```
Output in the folder: `photos/<name>.webp`, `alts.tsv`, `contact-sheet.html` and `contact-sheet.jpg`, `logs/`.
Running it again resumes where it stopped. Two attempts per photo. One batch at a time per machine.

Other commands: `image-codex "<description>" out.webp [size]` (one photo), `image-ralph in.png out.webp [size]` (Ralph's tool only), `python3 lib/check-ai-label.py <images>` (check files).

To add a reusable setting, add a text file in `decors/` and open a pull request.

---

## Français

Crée une série de photos réalistes pour un site client, en une seule commande : même décor sur chaque photo, plusieurs angles, WebP 4:3 avec noms SEO, étiquette IA retirée, brouillons d'alt et planche de relecture.

Première utilisation : handsoffmyhobby.org (78 photos, 26 pages). Demandé par Sourav, construit par le terminal 2 de Remi, novembre 2026.

## Ce qui est automatisé
Pour chaque photo de la liste :
1. **Création** avec Codex (compte ChatGPT) : décor commun + sujet + angle.
2. **Nettoyage** avec l'outil de Ralph (https://sitegrow-images.vercel.app/), qui retire l'étiquette « créé par IA ».
3. **Contrôle** qu'il ne reste aucune étiquette IA (C2PA / Content Credentials, métadonnées OpenAI ou ChatGPT). Le contrôle lit la structure du fichier : aucune fausse alerte.
4. **Enregistrement** en WebP avec son nom SEO (4:3, 1448 x 1086 par défaut).
5. **Brouillons d'alt** dans les langues demandées : Codex regarde la photo terminée.
6. **Planche** de toute la série pour la relecture.

## Ce qui reste humain (volontairement)
1. Regarder la planche : anatomie, couleurs, pose. Refaire ce qui est faux avec `--refaire <nom>`.
2. Relire chaque alt en regardant la photo (une ligne qui commence par CHECK = la photo ne colle pas au sujet).
3. Ajouter les photos au site (chaque site est différent).

Règle : toujours décrire le sujet en texte. Ne jamais partir de la photo de quelqu'un d'autre (droits d'auteur).

## Prérequis
- Linux ou macOS avec `bash`, `python3`, `node` 18+ et `flock` (sur macOS : `brew install flock`).
- **Codex CLI** connecté au compte ChatGPT de l'équipe (`codex login`, demander à Jordan).
- Hors du serveur de dev de Sitegrow, les scripts ouvrent l'outil de Ralph avec Playwright Chromium : lancer `npm install` une fois. Le profil du navigateur est gardé dans `~/.sitegrow-images-lot/profile` ; si l'outil demande un jour un mot de passe d'équipe, lancer une série avec `HEADED=1` pour le taper une seule fois.

## Installation
```bash
git clone git@github.com:Sitegrow-dev/sitegrow-images-lot.git
cd sitegrow-images-lot
npm install          # inutile sur le serveur de dev de Sitegrow (co-navigateur partagé)
./install.sh         # relie images-lot, image-codex et image-ralph dans ~/.local/bin
```

## Utilisation
Créer un dossier avec deux fichiers :

- `decor.txt` : le décor commun en anglais, ou le nom d'un décor de `decors/` (ex. `aquarium`).
- `photos.tsv` : une ligne par photo, séparée par des tabulations : `nom-seo <TAB> sujet <TAB> angle (facultatif)`. Pour 2 ou 3 angles d'un même sujet, écrire 2 ou 3 lignes avec des angles différents.

Puis :
```bash
images-lot <dossier> --alts en,fr      # environ 1 min 30 par photo
images-lot <dossier> --refaire <nom>   # recrée une photo refusée
images-lot <dossier> --taille blog     # 1200 x 800 au lieu du 4:3
images-lot <dossier> --planche         # refait seulement la planche
```
Sorties dans le dossier : `photos/<nom>.webp`, `alts.tsv`, `contact-sheet.html` et `contact-sheet.jpg`, `logs/`.
Relancer reprend là où ça s'est arrêté. Deux essais par photo. Une seule série à la fois par machine.

Autres commandes : `image-codex "<description>" sortie.webp [taille]` (une photo), `image-ralph entree.png sortie.webp [taille]` (seulement l'outil de Ralph), `python3 lib/check-ai-label.py <images>` (vérifier des fichiers).

Pour ajouter un décor réutilisable : un fichier texte dans `decors/`, puis une pull request.
