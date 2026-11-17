# Letter recordings

Each `.m4a` file is a recording of one letter, named with an ASCII slug of its romanization (`aa` = ആ, `nga` = ങ, `dda` = ഡ, `ttha` = ഠ, `nna` = ണ, `sha` = ശ, `ssa` = ഷ). The `recordings` table in `src/data/alphabet.ts` maps each glyph to its file and sets `audioUrl` to `/audio/<slug>.m4a`. The audio player applies `publicAssetPath()`, so files are served from `/aksharam/audio/` on GitHub Pages. A test checks that every mapped file exists and every file is mapped.

## How the files were prepared

The original takes (stereo AAC voice memos) were kept unchanged outside the repo. Each was converted to mono 48 kHz and then:

1. High-passed at 75 Hz to remove rumble and DC offset.
2. Denoised with a gentle spectral gate using a noise profile from the quietest frames (at most 18 dB of reduction, to avoid artifacts).
3. Trimmed to the spoken syllable, dropping the tap/click at the start of a take, with 60 ms lead-in and 150 ms tail plus short fades.
4. Loudness-matched to the same speech level (about -20 dBFS RMS over voiced frames) with peaks kept below -1 dBFS.
5. Encoded as AAC mono, 64 kbps.

## Adding recordings

Record vowels and full consonant syllables distinctly; chillu recordings should not add an inherent vowel. For dependent signs, record a consonant-plus-sign example, such as കാ, rather than an isolated combining mark. Process new takes the same way so levels stay consistent, add the file here, and add the glyph to `recordings`.

Cards without a recording fall back to a browser voice only when a Malayalam (`ml`) voice is installed; no English voice is ever substituted.
