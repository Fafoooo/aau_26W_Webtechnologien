// AI-assisted implementation; see ../erklaerung_1_2.md and the AI report.
'use strict';

(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    if (sections.length === 0) return;
    const form = document.createElement('form');
    form.id = 'section-editor';
    const select = document.createElement('select');
    select.id = 'section-select';
    const headingInput = document.createElement('input');
    headingInput.id = 'heading-input';
    headingInput.type = 'text';
    const textarea = document.createElement('textarea');
    textarea.id = 'section-source';
    textarea.rows = 12;
    textarea.cols = 70;
    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.textContent = 'Update section';
    submit.disabled = true;
    const warning = document.createElement('p');
    warning.textContent = 'Local HTML editor: use trusted HTML only. Changes are not saved to disk.';

    function addField(caption, control) {
        const paragraph = document.createElement('p');
        const label = document.createElement('label');
        label.htmlFor = control.id;
        label.textContent = caption;
        paragraph.append(label, document.createElement('br'), control);
        form.append(paragraph);
    }

    function sectionHeading(section) {
        return section.querySelector(':scope > h1');
    }

    function refreshOptions(selectedValue = '') {
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Choose a section';
        select.replaceChildren(placeholder);
        sections.forEach((section, index) => {
            const option = document.createElement('option');
            option.value = String(index);
            const heading = sectionHeading(section);
            option.textContent = heading ? heading.textContent : `Section ${index + 1}`;
            select.append(option);
        });
        select.value = selectedValue;
    }

    function selectedSection() {
        if (select.value === '') return null;
        return sections[Number(select.value)] || null;
    }

    select.addEventListener('change', () => {
        const section = selectedSection();
        submit.disabled = section === null;
        const heading = section ? sectionHeading(section) : null;
        headingInput.value = heading ? heading.textContent : '';
        textarea.value = section ? section.innerHTML : '';
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        const section = selectedSection();
        if (section === null) return;
        // Intentionally edit trusted HTML, not plain text: this is NOT a sanitizer.
        section.innerHTML = textarea.value;
        let heading = sectionHeading(section);
        if (heading === null) {
            heading = document.createElement('h1');
            section.prepend(heading);
        }
        heading.textContent = headingInput.value;
        refreshOptions(select.value);
        textarea.value = section.innerHTML;
    });

    addField('Section:', select);
    addField('Heading (overrides the HTML heading):', headingInput);
    addField('Section HTML:', textarea);
    form.append(submit, warning);
    refreshOptions();
    sections[sections.length - 1].after(form);
})();
