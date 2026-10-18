// AI-assisted implementation (OpenAI gpt-6.1-sol); see ../erklaerung_3_4.md.
(() => {
    "use strict";
    const source = document.getElementById("puzzleSource");
    const targets = Array.from(document.querySelectorAll("div[data-result]"));
    const placed = new Map();
    let selected = null;
    let ghost = null;

    const status = document.createElement("p");
    status.setAttribute("role", "status");
    status.textContent = "Click a piece, move the mouse, then click a target. Escape cancels.";
    source.before(status);
    for (const target of targets) {
        target.style.backgroundSize = "100% 100%";
        target.style.backgroundRepeat = "no-repeat";
        target.style.cursor = "pointer";
    }
    source.style.cursor = "pointer";

    function follow(event) {
        if (!ghost) return;
        ghost.style.left = `${event.clientX + 16}px`;
        ghost.style.top = `${event.clientY + 16}px`;
    }

    function cancel() {
        if (selected) selected.style.opacity = "";
        if (ghost) ghost.remove();
        selected = null;
        ghost = null;
    }

    function select(piece, event) {
        cancel();
        selected = piece;
        selected.style.opacity = "0.4";
        ghost = piece.cloneNode(false);
        ghost.removeAttribute("id");
        ghost.className = "puzzle-ghost";
        ghost.setAttribute("aria-hidden", "true");
        Object.assign(ghost.style, {
            position: "fixed", pointerEvents: "none", zIndex: "1000",
            opacity: "0.75", width: "160px", height: "auto"
        });
        document.body.append(ghost);
        follow(event);
    }

    function updateStatus() {
        const correct = (target) => {
            const piece = placed.get(target);
            return piece && piece.src === new URL(target.dataset.result, document.baseURI).href;
        };
        if (targets.length > 0 && targets.every(correct)) {
            status.textContent = "You win! All pictures are in the correct position.";
        } else if (targets.some((target) => placed.has(target) && !correct(target))) {
            status.textContent = "Wrong placement. Try another piece or click a placed picture to pick it up.";
        } else {
            status.textContent = "Correct placement. Keep going!";
        }
    }

    function place(target) {
        const previous = placed.get(target);
        if (previous) source.append(previous);
        placed.set(target, selected);
        target.style.backgroundImage = `url(${JSON.stringify(selected.src)})`;
        selected.remove();
        cancel();
        updateStatus();
    }

    document.addEventListener("mousemove", follow);
    document.addEventListener("click", (event) => {
        const piece = event.target.closest("#puzzleSource img");
        if (piece) {
            select(piece, event);
            return;
        }
        // Hit-test the actual pointer, not the offset preview or a fixed grid index.
        const hit = document.elementFromPoint(event.clientX, event.clientY);
        const target = hit && hit.closest("div[data-result]");
        if (!targets.includes(target)) return;
        if (selected) {
            place(target);
        } else if (placed.has(target)) {
            const previous = placed.get(target);
            placed.delete(target);
            target.style.backgroundImage = "";
            source.append(previous);
            select(previous, event);
            updateStatus();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") cancel();
    });
})();
