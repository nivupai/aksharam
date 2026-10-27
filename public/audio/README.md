# Native-speaker recordings

Add licensed, verified native Malayalam recordings here. In `src/data/alphabet.ts`, set a letter's optional `audioUrl` to `/audio/your-file.mp3`. The audio player applies `publicAssetPath()`, so this is served from `/aksharam/audio/your-file.mp3` on GitHub Pages. Keep the stable letter ID unchanged.

Record vowels and full consonant syllables distinctly; chillu recordings should not add an inherent vowel. For dependent signs, record and label a consonant-plus-sign example, such as കാ, rather than attempting to pronounce an isolated combining mark. A linguist or native-language educator should review the files before distribution.

No audio recordings are bundled. The player only enables browser speech when a voice with a Malayalam (`ml`) language tag is actually available. It never substitutes an English voice.
