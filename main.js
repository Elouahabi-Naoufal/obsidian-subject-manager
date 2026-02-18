const { Plugin, Modal, Setting, Notice } = require('obsidian');

class SubjectManagerModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: 'Create New Subject' });

        let subjectNumber = '';
        let subjectName = '';
        let teacher = '';
        let module = '';

        new Setting(contentEl)
            .setName('Subject Number')
            .setDesc('Enter subject number (e.g., 01, 02)')
            .addText(text => text
                .setPlaceholder('01')
                .onChange(value => subjectNumber = value));

        new Setting(contentEl)
            .setName('Subject Name')
            .setDesc('Enter the name of the subject')
            .addText(text => text
                .setPlaceholder('Mathematics')
                .onChange(value => subjectName = value));

        const teachers = this.plugin.getTeachers();
        new Setting(contentEl)
            .setName('Teacher')
            .setDesc('Select or enter teacher name')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select or type below --');
                teachers.forEach(t => dropdown.addOption(t, t));
                dropdown.onChange(value => {
                    if (value) teacher = value;
                });
            });

        new Setting(contentEl)
            .addText(text => text
                .setPlaceholder('Or type new teacher name')
                .onChange(value => {
                    if (value) teacher = value;
                }));

        const modules = this.plugin.getModules();
        new Setting(contentEl)
            .setName('Module')
            .setDesc('Select or enter module name')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select or type below --');
                modules.forEach(m => dropdown.addOption(m, m));
                dropdown.onChange(value => {
                    if (value) module = value;
                });
            });

        new Setting(contentEl)
            .addText(text => text
                .setPlaceholder('Or type new module name')
                .onChange(value => {
                    if (value) module = value;
                }));

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Create')
                .setCta()
                .onClick(async () => {
                    if (!subjectNumber || !subjectName) {
                        new Notice('Subject number and name are required!');
                        return;
                    }
                    await this.plugin.createSubject(subjectNumber, subjectName, teacher, module);
                    this.close();
                }));
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

module.exports = class SubjectManagerPlugin extends Plugin {
    async onload() {
        await this.loadData();

        this.addCommand({
            id: 'create-subject',
            name: 'Create New Subject',
            callback: () => {
                new SubjectManagerModal(this.app, this).open();
            }
        });

        this.addRibbonIcon('folder-plus', 'Create Subject', () => {
            new SubjectManagerModal(this.app, this).open();
        });
    }

    async loadData() {
        try {
            const data = await this.app.vault.adapter.read('.obsidian/plugins/subject-manager/subjects.json');
            this.subjects = JSON.parse(data);
        } catch {
            this.subjects = [];
        }
    }

    async saveData() {
        await this.app.vault.adapter.write('.obsidian/plugins/subject-manager/subjects.json', JSON.stringify(this.subjects, null, 2));
    }

    getTeachers() {
        return [...new Set(this.subjects.map(s => s.teacher).filter(Boolean))];
    }

    getModules() {
        return [...new Set(this.subjects.map(s => s.module).filter(Boolean))];
    }

    async createSubject(number, name, teacher, module) {
        const folderName = `${number}-${name}`;
        
        try {
            await this.app.vault.createFolder(folderName);
            
            const subject = {
                number,
                name,
                folderName,
                teacher: teacher || '',
                module: module || '',
                dateCreated: new Date().toISOString()
            };
            
            this.subjects.push(subject);
            await this.saveData();
            
            new Notice(`Subject "${folderName}" created successfully!`);
        } catch (error) {
            new Notice(`Error: ${error.message}`);
        }
    }
};
