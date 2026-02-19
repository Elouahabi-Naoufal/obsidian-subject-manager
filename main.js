const { Plugin, Modal, Setting, Notice, SuggestModal } = require('obsidian');

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
        let room = '';
        let day = '';
        let time = '';

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

        const rooms = this.plugin.getRooms();
        new Setting(contentEl)
            .setName('Room')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select or type below --');
                rooms.forEach(r => dropdown.addOption(r, r));
                dropdown.onChange(value => {
                    if (value) room = value;
                });
            });

        new Setting(contentEl)
            .addText(text => text
                .setPlaceholder('Or type new room')
                .onChange(value => {
                    if (value) room = value;
                }));

        new Setting(contentEl)
            .setName('Day')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select day --');
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(d => 
                    dropdown.addOption(d, d)
                );
                dropdown.onChange(value => day = value);
            });

        new Setting(contentEl)
            .setName('Time')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select or type below --');
                const times = this.plugin.getTimes();
                times.forEach(t => dropdown.addOption(t, t));
                dropdown.onChange(value => {
                    if (value) time = value;
                });
            });

        new Setting(contentEl)
            .addText(text => text
                .setPlaceholder('e.g., 08:00-10:00')
                .onChange(value => {
                    if (value) time = value;
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
                    await this.plugin.createSubject(subjectNumber, subjectName, teacher, module, room, day, time);
                    this.close();
                }));
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class EditSubjectModal extends Modal {
    constructor(app, plugin, subject, keepOpen = false) {
        super(app);
        this.plugin = plugin;
        this.subject = subject;
        this.keepOpen = keepOpen;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: 'Edit Subject' });

        let subjectNumber = this.subject.number;
        let subjectName = this.subject.name;
        let teacher = this.subject.teacher;
        let module = this.subject.module;
        let room = this.subject.room || '';
        let day = this.subject.day || '';
        let time = this.subject.time || '';

        new Setting(contentEl)
            .setName('Subject Number')
            .addText(text => text
                .setValue(subjectNumber)
                .onChange(value => subjectNumber = value));

        new Setting(contentEl)
            .setName('Subject Name')
            .addText(text => text
                .setValue(subjectName)
                .onChange(value => subjectName = value));

        const teachers = this.plugin.getTeachers();
        new Setting(contentEl)
            .setName('Teacher')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select or type below --');
                teachers.forEach(t => dropdown.addOption(t, t));
                dropdown.setValue(teacher);
                dropdown.onChange(value => {
                    if (value) teacher = value;
                });
            });

        new Setting(contentEl)
            .addText(text => text
                .setPlaceholder('Or type new teacher name')
                .setValue(teacher)
                .onChange(value => {
                    if (value) teacher = value;
                }));

        const modules = this.plugin.getModules();
        new Setting(contentEl)
            .setName('Module')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select or type below --');
                modules.forEach(m => dropdown.addOption(m, m));
                dropdown.setValue(module);
                dropdown.onChange(value => {
                    if (value) module = value;
                });
            });

        new Setting(contentEl)
            .addText(text => text
                .setPlaceholder('Or type new module name')
                .setValue(module)
                .onChange(value => {
                    if (value) module = value;
                }));

        const rooms = this.plugin.getRooms();
        new Setting(contentEl)
            .setName('Room')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select or type below --');
                rooms.forEach(r => dropdown.addOption(r, r));
                dropdown.setValue(room);
                dropdown.onChange(value => {
                    if (value) room = value;
                });
            });

        new Setting(contentEl)
            .addText(text => text
                .setPlaceholder('Or type new room')
                .setValue(room)
                .onChange(value => {
                    if (value) room = value;
                }));

        new Setting(contentEl)
            .setName('Day')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select day --');
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(d => 
                    dropdown.addOption(d, d)
                );
                dropdown.setValue(day);
                dropdown.onChange(value => day = value);
            });

        new Setting(contentEl)
            .setName('Time')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select or type below --');
                const times = this.plugin.getTimes();
                times.forEach(t => dropdown.addOption(t, t));
                dropdown.setValue(time);
                dropdown.onChange(value => {
                    if (value) time = value;
                });
            });

        new Setting(contentEl)
            .addText(text => text
                .setPlaceholder('e.g., 08:00-10:00')
                .setValue(time)
                .onChange(value => {
                    if (value) time = value;
                }));

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Save')
                .setCta()
                .onClick(async () => {
                    if (!subjectNumber || !subjectName) {
                        new Notice('Subject number and name are required!');
                        return;
                    }
                    await this.plugin.editSubject(this.subject, subjectNumber, subjectName, teacher, module, room, day, time);
                    if (this.keepOpen) {
                        new SelectSubjectModal(this.app, this.plugin, true).open();
                    }
                    this.close();
                }));

        if (this.keepOpen) {
            new Setting(contentEl)
                .addButton(btn => btn
                    .setButtonText('Stop Editing')
                    .onClick(() => this.close()));
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class SelectSubjectModal extends SuggestModal {
    constructor(app, plugin, keepOpen = false) {
        super(app);
        this.plugin = plugin;
        this.keepOpen = keepOpen;
    }

    getSuggestions(query) {
        return this.plugin.subjects.filter(s => 
            s.folderName.toLowerCase().includes(query.toLowerCase()) ||
            s.teacher.toLowerCase().includes(query.toLowerCase()) ||
            s.module.toLowerCase().includes(query.toLowerCase())
        );
    }

    renderSuggestion(subject, el) {
        el.createEl('div', { text: subject.folderName });
        el.createEl('small', { text: `Teacher: ${subject.teacher || 'N/A'} | Module: ${subject.module || 'N/A'}` });
    }

    async onChooseSuggestion(subject) {
        new EditSubjectModal(this.app, this.plugin, subject, this.keepOpen).open();
    }
}

class DeleteSubjectModal extends SuggestModal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }

    getSuggestions(query) {
        return this.plugin.subjects.filter(s => 
            s.folderName.toLowerCase().includes(query.toLowerCase()) ||
            s.teacher.toLowerCase().includes(query.toLowerCase()) ||
            s.module.toLowerCase().includes(query.toLowerCase())
        );
    }

    renderSuggestion(subject, el) {
        el.createEl('div', { text: subject.folderName });
        el.createEl('small', { text: `Teacher: ${subject.teacher || 'N/A'} | Module: ${subject.module || 'N/A'}` });
    }

    async onChooseSuggestion(subject) {
        await this.plugin.deleteSubject(subject);
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

        this.addCommand({
            id: 'delete-subject',
            name: 'Delete Subject',
            callback: () => {
                new DeleteSubjectModal(this.app, this).open();
            }
        });

        this.addCommand({
            id: 'edit-subject',
            name: 'Edit Subject',
            callback: () => {
                new SelectSubjectModal(this.app, this).open();
            }
        });

        this.addCommand({
            id: 'apply-changes',
            name: 'Apply Changes from subjects.json',
            callback: async () => {
                await this.applyChangesFromJson();
            }
        });

        this.addCommand({
            id: 'bulk-edit-subjects',
            name: 'Bulk Edit Subjects',
            callback: () => {
                new SelectSubjectModal(this.app, this, true).open();
            }
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

    getRooms() {
        return [...new Set(this.subjects.map(s => s.room).filter(Boolean))];
    }

    getTimes() {
        return [...new Set(this.subjects.map(s => s.time).filter(Boolean))];
    }

    async createSubject(number, name, teacher, module, room, day, time) {
        const folderName = `${number}-${name}`;
        
        try {
            await this.app.vault.createFolder(folderName);
            
            const subject = {
                number,
                name,
                folderName,
                teacher: teacher || '',
                module: module || '',
                room: room || '',
                day: day || '',
                time: time || '',
                dateCreated: new Date().toISOString()
            };
            
            this.subjects.push(subject);
            await this.saveData();
            
            new Notice(`Subject "${folderName}" created successfully!`);
        } catch (error) {
            new Notice(`Error: ${error.message}`);
        }
    }

    async deleteSubject(subject) {
        try {
            const folder = this.app.vault.getAbstractFileByPath(subject.folderName);
            if (folder) {
                await this.app.vault.delete(folder, true);
            }
            
            this.subjects = this.subjects.filter(s => s.folderName !== subject.folderName);
            await this.saveData();
            
            new Notice(`Subject "${subject.folderName}" deleted successfully!`);
        } catch (error) {
            new Notice(`Error: ${error.message}`);
        }
    }

    async editSubject(oldSubject, number, name, teacher, module, room, day, time) {
        const newFolderName = `${number}-${name}`;
        
        try {
            if (oldSubject.folderName !== newFolderName) {
                const oldFolder = this.app.vault.getAbstractFileByPath(oldSubject.folderName);
                if (oldFolder) {
                    await this.app.vault.rename(oldFolder, newFolderName);
                }
            }
            
            const index = this.subjects.findIndex(s => s.folderName === oldSubject.folderName);
            if (index !== -1) {
                this.subjects[index] = {
                    ...oldSubject,
                    number,
                    name,
                    folderName: newFolderName,
                    teacher: teacher || '',
                    module: module || '',
                    room: room || '',
                    day: day || '',
                    time: time || ''
                };
            }
            
            await this.saveData();
            new Notice(`Subject updated successfully!`);
        } catch (error) {
            new Notice(`Error: ${error.message}`);
        }
    }

    async applyChangesFromJson() {
        try {
            await this.loadData();
            
            const existingFolders = this.app.vault.getAllLoadedFiles()
                .filter(f => f.children && f.parent?.path === '')
                .map(f => f.path);
            
            const jsonFolders = this.subjects.map(s => s.folderName);
            let deleted = 0, created = 0;
            
            // Delete folders with xx- format not in JSON
            for (const folder of existingFolders) {
                if (/^\d{2}-/.test(folder) && !jsonFolders.includes(folder)) {
                    const f = this.app.vault.getAbstractFileByPath(folder);
                    if (f) {
                        await this.app.vault.delete(f, true);
                        deleted++;
                    }
                }
            }
            
            // Create missing folders from JSON
            for (const subject of this.subjects) {
                if (!existingFolders.includes(subject.folderName)) {
                    await this.app.vault.createFolder(subject.folderName);
                    created++;
                }
            }
            
            new Notice(`Applied! Created: ${created}, Deleted: ${deleted}`);
        } catch (error) {
            new Notice(`Error: ${error.message}`);
        }
    }
};
