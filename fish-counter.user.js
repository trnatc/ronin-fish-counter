// ==UserScript==
// @name         Fish Counter and RON Value - Clean & Fixed
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Displays fish names, counts, and RON value in a fixed, scroll-free box. Compact and readable.
// @author       You
// @match        https://marketplace.roninchain.com/account
// @match        https://marketplace.roninchain.com/account/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const fishCache = new Map();
    const seenTokens = new Set();
    let debounceTimeout;

    const style = document.createElement('style');
    style.textContent = `
        #ronin-fish-counter {
            position: fixed;
            top: 120px;
            right: 20px;
            background: linear-gradient(145deg, #2a2a3a, #1e1e2e);
            padding: 12px 14px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            font-size: 13px;
            line-height: 1.15;
            color: #e0e0e0;
            width: 320px;
            max-height: none;
            overflow-y: visible;
            user-select: none;
        }
        #ronin-fish-counter .title {
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 8px;
            color: #00ccff;
        }
        #ronin-fish-counter .fish-row {
            display: grid;
            grid-template-columns: minmax(140px, 1fr) 80px 70px;
            padding: 0;
            margin: 0;
            border-radius: 0;
            background: transparent;
            line-height: 1.3;
            white-space: nowrap;
        }
        #ronin-fish-counter .fish-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-right: 10px;
        }
        #ronin-fish-counter .fish-count {
            text-align: right;
            font-weight: 500;
            white-space: nowrap;
            padding-right: 10px;
        }
        #ronin-fish-counter .total-count {
            color: #00ccff;
        }
        #ronin-fish-counter .listed-count {
            color: #ff5555;
        }
        #ronin-fish-counter .fish-ron {
            text-align: right;
            font-weight: 500;
            color: #ffcc00;
            white-space: nowrap;
        }
        #ronin-fish-counter .total-row {
            margin-top: 10px;
            border-top: 1px solid rgba(255,255,255,0.2);
            padding-top: 8px;
            font-weight: 600;
            display: grid;
            grid-template-columns: minmax(140px, 1fr) 80px 70px;
            color: #ffffff;
            white-space: nowrap;
        }
        #ronin-fish-counter .error {
            font-style: italic;
            color: #ff5555;
        }
    `;
    document.head.appendChild(style);

    function collectFish() {
        const fishCards = document.querySelectorAll('.virtuoso-grid-item');

        fishCards.forEach(card => {
            const tokenIdElement = card.querySelector('.tag-module_content__5K0dl');
            const nameElements = card.querySelectorAll('.CommonFooter_name__EgS5Q');
            const priceElement = card.querySelector('.TokenPrice_price__YxArE');

            if (tokenIdElement && nameElements.length >= 2) {
                const tokenId = tokenIdElement.textContent.trim();
                const fishType = nameElements[1].textContent.trim();
                let price = 0;
                let isListed = false;

                if (priceElement) {
                    const priceText = priceElement.textContent.trim();
                    price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
                    isListed = true;
                }

                if (!seenTokens.has(tokenId) && fishType) {
                    seenTokens.add(tokenId);
                    const current = fishCache.get(fishType) || { count: 0, listedCount: 0, totalRon: 0 };
                    fishCache.set(fishType, {
                        count: current.count + 1,
                        listedCount: current.listedCount + (isListed ? 1 : 0),
                        totalRon: current.totalRon + price
                    });
                }
            }
        });

        updateCounterDisplay();
    }

    function updateCounterDisplay() {
        let counter = document.getElementById('ronin-fish-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'ronin-fish-counter';
            document.body.appendChild(counter);
        }

        let html = `<div class="title">Fish Count</div>`;

        if (seenTokens.size === 0) {
            html += `<div class="error">No fish found. Please select an account.</div>`;
        } else {
            const sortedFish = Array.from(fishCache.entries()).sort((a, b) => b[1].count - a[1].count);
            let totalCount = 0, totalListed = 0, totalRon = 0;

            sortedFish.forEach(([fish, data]) => {
                totalCount += data.count;
                totalListed += data.listedCount;
                totalRon += data.totalRon;
                html += `
                <div class="fish-row" title="${fish} - Total: ${data.count}, Listed: ${data.listedCount}, RON: ${data.totalRon.toFixed(2)}">
                    <div class="fish-name">${fish}</div>
                    <div class="fish-count">
                        <span class="total-count">${data.count}</span>/<span class="listed-count">${data.listedCount}</span>
                    </div>
                    <div class="fish-ron">${data.totalRon.toFixed(2)}</div>
                </div>`;
            });

            html += `
            <div class="total-row" title="Total Fish and RON">
                <div>TOTAL:</div>
                <div class="fish-count">
                    <span class="total-count">${totalCount}</span>/<span class="listed-count">${totalListed}</span>
                </div>
                <div class="fish-ron">${totalRon.toFixed(2)} RON</div>
            </div>`;
        }

        counter.innerHTML = html;
    }

    function debounceCollectFish() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(collectFish, 300);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const checkFishLoaded = setInterval(() => {
            const fishCards = document.querySelectorAll('.virtuoso-grid-item');
            if (fishCards.length > 0 || document.querySelector('.TokensLayout_tokensLayout__LWfq_')) {
                clearInterval(checkFishLoaded);
                collectFish();
            }
        }, 500);
    });

    window.addEventListener('scroll', debounceCollectFish);
    const observer = new MutationObserver(debounceCollectFish);
    const targetNode = document.querySelector('.TokensLayout_tokensLayout__LWfq_') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true });
})();
