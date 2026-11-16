const sections = document.querySelectorAll("section");  // alle Sections der Seite, Liste ändert sich nie

// Formular mit allen Teilen erzeugen
const form = document.createElement("form");
const select = document.createElement("select");
const headingInput = document.createElement("input");
const contentArea = document.createElement("textarea");
const submitButton = document.createElement("button");

const placeholder = document.createElement("option");  // erste Zeile im Dropdown, nur ein Hinweis
placeholder.textContent = "-- choose a section --";
placeholder.value = "";
placeholder.disabled = true;                            // kann man nicht auswählen
placeholder.selected = true;                            // ist am Anfang angezeigt
select.append(placeholder);

for (let i = 0; i < sections.length; i++) {             // pro Section eine Zeile im Dropdown
    const option = document.createElement("option");
    option.value = i;                                   // value = Nummer der Section in der Liste
    option.textContent = getHeadingText(sections[i]);   // angezeigt wird die Überschrift
    select.append(option);
}

headingInput.type = "text";                   // Das Textfeld ist für normalen Text
headingInput.required = true;                 // Das Textfeld darf nicht leer sein
contentArea.rows = 12;                        // Die große Box ist 12 Zeilen hoch
submitButton.type = "submit";                 // Der Button ist ein Absende-Knopf: Klick = Formular abschicken
submitButton.textContent = "Update section";  // Das steht auf dem Button
submitButton.disabled = true;                 // Der Button ist am Anfang grau und aus

form.style.display = "flex";                  // flex + column = alle Teile untereinander statt nebeneinander
form.style.flexDirection = "column";
form.style.alignItems = "flex-start";         // alle Teile linksbündig
form.style.gap = "8px";                       // 8 Pixel Abstand zwischen den Teilen
form.style.marginTop = "20px";                // 20 Pixel Abstand nach oben zur Section
contentArea.style.width = "100%";             // die große Box ist so breit wie die Seite

form.append(select, headingInput, contentArea, submitButton);
sections[sections.length - 1].after(form);   // after = direkt hinter die letzte Section

// Section auswählen: Felder füllen und Button aktivieren
select.addEventListener("change", function () {           // Wenn sich im Dropdown etwas ändert, führe das hier aus
    const section = sections[select.value];               // Welche Section ist gewählt? 
    const heading = section.querySelector("h1");          // Sucht in dieser Section die Überschrift <h1>
    if (heading) {                                        // Gibt es eine Überschrift?
        headingInput.value = heading.textContent.trim();  // Ja -> ihr Text kommt ins Textfeld; trim = Leerzeichen am Anfang und Ende weg
    } else {
        headingInput.value = "";                          // Nein -> Textfeld bleibt leer
    }
    contentArea.value = section.innerHTML;                // In die große Box kommt der ganze Inhalt der Section als HTML-Text
    submitButton.disabled = false;                        // Der Button wird eingeschaltet
});

// Button geklickt: Section mit den neuen Daten überschreiben
form.addEventListener("submit", function (event) {        // Wenn das Formular abgeschickt wird (Klick auf den Button), führe das aus
    event.preventDefault();                               // Ein Formular würde die Seite neu laden, dann wäre alles weg -> "mach das nicht"
    const section = sections[select.value];               // Wieder: Welche Section ist gewählt?
    section.innerHTML = contentArea.value;                // Alles aus der großen Box wird in die Section geschrieben, die alte wird ersetzt

    let heading = section.querySelector("h1");            // In der neuen Section wieder nach der Überschrift suchen
    if (!heading) {                                       // !heading = keine Überschrift gefunden, weil du sie in der Box gelöscht hast
        heading = document.createElement("h1");           // Dann eine neue <h1> bauen
        section.prepend(heading);                         // prepend = ganz oben in die Section setzen
    }
    heading.textContent = headingInput.value;             // Überschrift bekommt den Text aus dem Textfeld; wird als Letztes geschrieben -> Textfeld gewinnt immer

    select.options[select.selectedIndex].textContent = heading.textContent;  // selectedIndex = gerade gewählte Zeile im Dropdown -> bekommt den neuen Text
    contentArea.value = section.innerHTML;                // Die große Box zeigt jetzt den neuen Stand
});

function getHeadingText(section) {                        // Helfer: "Gib mir eine Section, ich sag dir, wie sie heißt"
    const heading = section.querySelector("h1");          // h1 in der Section suchen
    if (heading) {
        return heading.textContent.trim();                // gefunden -> Text der Überschrift zurückgeben
    }
    return "(no heading)";                                // nicht gefunden -> Ersatztext, damit nichts abstürzt
}
