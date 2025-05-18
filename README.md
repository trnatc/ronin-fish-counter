# Ronin Marketplace - Fish Counter & RON Value (Tampermonkey Script)

A clean, fixed-position panel that displays your fish types, quantity, how many are listed, and their total RON value.

> Works on **https://marketplace.roninchain.com** — originally built for **Fishing Frenzy**, but supports **all collections** in your profile inventory.

---

## 🚀 Features
- Lists all fish/NFT names clearly.
- Shows how many of each type you own, how many are listed.
- Calculates total RON value.
- No scroll, clean layout, fixed to the page.

---

## 🧠 How it works

- When you open [Ronin Marketplace Account Page](https://marketplace.roninchain.com/account), this script will auto-start.
- It scans all NFT cards dynamically.
- It keeps track of which tokens you've already counted (to avoid duplicates).
- Whenever the page changes or scrolls, the panel updates.

---

## 🛠️ Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension.
2. Create a new userscript and paste in the code from [`fish-counter.user.js`](fish-counter.user.js).
3. Save the script and visit [Ronin Marketplace Profile](https://marketplace.roninchain.com/account).

> The panel will appear in the top right corner.

---

## 🐟 Preview

![Fish Counter Screenshot](https://raw.githubusercontent.com/trnatc/ronin-fish-counter/main/Fish.png)


## ☕ Like it? Buy me a coffee in $RON

`0x88888757D076495f53E988ffD1c1294aAC488888`

Thanks for your support!

---

## 📦 File

- `fish-counter.user.js`: The userscript code.
- `README.md`: This file.
