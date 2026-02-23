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

        const mode = this.plugin.scheduleMode;
        contentEl.createEl('p', { text: `Current schedule: ${mode}`, cls: 'mod-warning' });

        let subjectNumber = '';
        let subjectName = '';
        let teacher = '';
        let module = '';
        let room = '';
        let dayNormal = '';
        let timeNormal = '';
        let dayRamadan = '';
        let timeRamadan = '';

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
            .setName('Day (Normal)')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select day --');
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(d => 
                    dropdown.addOption(d, d)
                );
                dropdown.onChange(value => dayNormal = value);
            });

        new Setting(contentEl)
            .setName('Time (Normal)')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select or type below --');
                const times = this.plugin.getTimes();
                times.forEach(t => dropdown.addOption(t, t));
                dropdown.onChange(value => {
                    if (value) timeNormal = value;
                });
            });

        new Setting(contentEl)
            .addText(text => text
                .setPlaceholder('e.g., 08:00-10:00')
                .onChange(value => {
                    if (value) timeNormal = value;
                }));

        new Setting(contentEl)
            .setName('Day (Ramadan)')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select day --');
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(d => 
                    dropdown.addOption(d, d)
                );
                dropdown.onChange(value => dayRamadan = value);
            });

        new Setting(contentEl)
            .setName('Time (Ramadan)')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select or type below --');
                const times = this.plugin.getTimes();
                times.forEach(t => dropdown.addOption(t, t));
                dropdown.onChange(value => {
                    if (value) timeRamadan = value;
                });
            });

        new Setting(contentEl)
            .addText(text => text
                .setPlaceholder('e.g., 08:00-10:00')
                .onChange(value => {
                    if (value) timeRamadan = value;
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
                    await this.plugin.createSubject(subjectNumber, subjectName, teacher, module, room, dayNormal, timeNormal, dayRamadan, timeRamadan);
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

        const mode = this.plugin.scheduleMode;
        contentEl.createEl('p', { text: `Current schedule: ${mode}`, cls: 'mod-warning' });

        let subjectNumber = this.subject.number;
        let subjectName = this.subject.name;
        let teacher = this.subject.teacher;
        let module = this.subject.module;
        let room = this.subject.room || '';
        let dayNormal = this.subject.dayNormal || this.subject.day || '';
        let timeNormal = this.subject.timeNormal || this.subject.time || '';
        let dayRamadan = this.subject.dayRamadan || '';
        let timeRamadan = this.subject.timeRamadan || '';

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
            .setName('Day (Normal)')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select day --');
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(d => 
                    dropdown.addOption(d, d)
                );
                dropdown.setValue(dayNormal);
                dropdown.onChange(value => dayNormal = value);
            });

        new Setting(contentEl)
            .setName('Time (Normal)')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select or type below --');
                const times = this.plugin.getTimes();
                times.forEach(t => dropdown.addOption(t, t));
                dropdown.setValue(timeNormal);
                dropdown.onChange(value => {
                    if (value) timeNormal = value;
                });
            });

        new Setting(contentEl)
            .addText(text => text
                .setPlaceholder('e.g., 08:00-10:00')
                .setValue(timeNormal)
                .onChange(value => {
                    if (value) timeNormal = value;
                }));

        new Setting(contentEl)
            .setName('Day (Ramadan)')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select day --');
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(d => 
                    dropdown.addOption(d, d)
                );
                dropdown.setValue(dayRamadan);
                dropdown.onChange(value => dayRamadan = value);
            });

        new Setting(contentEl)
            .setName('Time (Ramadan)')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select or type below --');
                const times = this.plugin.getTimes();
                times.forEach(t => dropdown.addOption(t, t));
                dropdown.setValue(timeRamadan);
                dropdown.onChange(value => {
                    if (value) timeRamadan = value;
                });
            });

        new Setting(contentEl)
            .addText(text => text
                .setPlaceholder('e.g., 08:00-10:00')
                .setValue(timeRamadan)
                .onChange(value => {
                    if (value) timeRamadan = value;
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
                    await this.plugin.editSubject(this.subject, subjectNumber, subjectName, teacher, module, room, dayNormal, timeNormal, dayRamadan, timeRamadan);
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

class AddExceptionModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: 'Add Schedule Exception' });

        let selectedSubject = null;
        let exceptionDate = '';
        let exceptionDay = '';
        let exceptionTime = '';

        new Setting(contentEl)
            .setName('Subject')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select subject --');
                this.plugin.subjects.forEach(s => {
                    dropdown.addOption(s.folderName, s.name);
                });
                dropdown.onChange(value => {
                    selectedSubject = this.plugin.subjects.find(s => s.folderName === value);
                });
            });

        new Setting(contentEl)
            .setName('Exception Date')
            .setDesc('Date of the exception (YYYY-MM-DD)')
            .addText(text => text
                .setPlaceholder('2025-03-15')
                .onChange(value => exceptionDate = value));

        new Setting(contentEl)
            .setName('New Day')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select day --');
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(d => 
                    dropdown.addOption(d, d)
                );
                dropdown.onChange(value => exceptionDay = value);
            });

        new Setting(contentEl)
            .setName('New Time')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select or type below --');
                const times = this.plugin.getTimes();
                times.forEach(t => dropdown.addOption(t, t));
                dropdown.onChange(value => {
                    if (value) exceptionTime = value;
                });
            });

        new Setting(contentEl)
            .addText(text => text
                .setPlaceholder('Or type new time')
                .onChange(value => {
                    if (value) exceptionTime = value;
                }));

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Add Exception')
                .setCta()
                .onClick(async () => {
                    if (!selectedSubject || !exceptionDate || !exceptionDay || !exceptionTime) {
                        new Notice('All fields are required!');
                        return;
                    }
                    await this.plugin.addException(selectedSubject, exceptionDate, exceptionDay, exceptionTime);
                    this.close();
                }));
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class ViewExceptionsModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: 'All Schedule Exceptions' });

        const allExceptions = [];
        this.plugin.subjects.forEach(subject => {
            if (subject.exceptions && subject.exceptions.length > 0) {
                subject.exceptions.forEach(exc => {
                    allExceptions.push({ ...exc, subject });
                });
            }
        });

        if (allExceptions.length === 0) {
            contentEl.createEl('p', { text: 'No exceptions found.' });
            return;
        }

        allExceptions.sort((a, b) => a.date.localeCompare(b.date));

        allExceptions.forEach(exc => {
            const div = contentEl.createDiv({ cls: 'schedule-item', attr: { style: 'padding: 10px; margin: 5px 0; border: 1px solid var(--background-modifier-border); border-radius: 5px;' } });
            div.createEl('strong', { text: `${exc.subject.name}` });
            div.createEl('br');
            div.createEl('span', { text: `Date: ${exc.date} | Day: ${exc.day} | Time: ${exc.time}` });
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class SelectExceptionModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: 'Select Exception' });

        const allExceptions = [];
        this.plugin.subjects.forEach(subject => {
            if (subject.exceptions && subject.exceptions.length > 0) {
                subject.exceptions.forEach((exc, index) => {
                    allExceptions.push({ ...exc, subject, index });
                });
            }
        });

        if (allExceptions.length === 0) {
            contentEl.createEl('p', { text: 'No exceptions found.' });
            return;
        }

        allExceptions.sort((a, b) => a.date.localeCompare(b.date));

        allExceptions.forEach(exc => {
            const div = contentEl.createDiv({ cls: 'schedule-item', attr: { style: 'padding: 10px; margin: 5px 0; border: 1px solid var(--background-modifier-border); border-radius: 5px; cursor: pointer;' } });
            div.createEl('strong', { text: `${exc.subject.name}` });
            div.createEl('br');
            div.createEl('span', { text: `Date: ${exc.date} | Day: ${exc.day} | Time: ${exc.time}` });
            
            new Setting(div)
                .addButton(btn => btn
                    .setButtonText('Edit')
                    .onClick(() => {
                        this.close();
                        new EditExceptionModal(this.app, this.plugin, exc, exc.subject, exc.index).open();
                    }))
                .addButton(btn => btn
                    .setButtonText('Delete')
                    .setWarning()
                    .onClick(async () => {
                        await this.plugin.deleteException(exc.subject, exc.index);
                        this.close();
                        new SelectExceptionModal(this.app, this.plugin).open();
                    }));
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class EditExceptionModal extends Modal {
    constructor(app, plugin, exception, subject, index) {
        super(app);
        this.plugin = plugin;
        this.exception = exception;
        this.subject = subject;
        this.index = index;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: `Edit Exception - ${this.subject.name}` });

        let exceptionDate = this.exception.date;
        let exceptionDay = this.exception.day;
        let exceptionTime = this.exception.time;

        new Setting(contentEl)
            .setName('Exception Date')
            .addText(text => text
                .setValue(exceptionDate)
                .onChange(value => exceptionDate = value));

        new Setting(contentEl)
            .setName('New Day')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select day --');
                ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(d => 
                    dropdown.addOption(d, d)
                );
                dropdown.setValue(exceptionDay);
                dropdown.onChange(value => exceptionDay = value);
            });

        new Setting(contentEl)
            .setName('New Time')
            .addDropdown(dropdown => {
                dropdown.addOption('', '-- Select or type below --');
                const times = this.plugin.getTimes();
                times.forEach(t => dropdown.addOption(t, t));
                dropdown.setValue(exceptionTime);
                dropdown.onChange(value => {
                    if (value) exceptionTime = value;
                });
            });

        new Setting(contentEl)
            .addText(text => text
                .setPlaceholder('Or type new time')
                .setValue(exceptionTime)
                .onChange(value => {
                    if (value) exceptionTime = value;
                }));

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText('Save')
                .setCta()
                .onClick(async () => {
                    await this.plugin.editException(this.subject, this.index, exceptionDate, exceptionDay, exceptionTime);
                    this.close();
                }));
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class CreateNoteFromExceptionModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: 'Create Note from Exception' });

        const allExceptions = [];
        const today = new Date().toISOString().split('T')[0];
        
        this.plugin.subjects.forEach(subject => {
            if (subject.exceptions && subject.exceptions.length > 0) {
                subject.exceptions.forEach((exc, index) => {
                    if (exc.date >= today) {
                        allExceptions.push({ ...exc, subject, index });
                    }
                });
            }
        });

        if (allExceptions.length === 0) {
            contentEl.createEl('p', { text: 'No future exceptions found.' });
            return;
        }

        allExceptions.sort((a, b) => a.date.localeCompare(b.date));

        allExceptions.forEach(exc => {
            const div = contentEl.createDiv({ cls: 'schedule-item', attr: { style: 'padding: 10px; margin: 5px 0; border: 1px solid var(--background-modifier-border); border-radius: 5px;' } });
            div.createEl('strong', { text: `${exc.subject.name}` });
            div.createEl('br');
            div.createEl('span', { text: `Date: ${exc.date} | Day: ${exc.day} | Time: ${exc.time}` });
            
            const templates = this.plugin.getTemplates();
            const setting = new Setting(div);
            
            templates.forEach(template => {
                setting.addButton(btn => btn
                    .setButtonText(template)
                    .onClick(async () => {
                        await this.plugin.createNoteFromException(exc, template);
                        this.close();
                    }));
            });
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class ScheduleViewModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        const mode = this.plugin.scheduleMode;
        contentEl.createEl('h2', { text: `Schedule - ${mode} Mode` });
        
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayField = mode === 'Ramadan' ? 'dayRamadan' : 'dayNormal';
        const timeField = mode === 'Ramadan' ? 'timeRamadan' : 'timeNormal';
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];
        
        days.forEach(day => {
            const daySubjects = this.plugin.subjects.filter(s => s[dayField] === day);
            
            // Get exceptions for this day (only future/today)
            const exceptions = [];
            this.plugin.subjects.forEach(s => {
                if (s.exceptions) {
                    s.exceptions.forEach(exc => {
                        if (exc.day === day && exc.date >= todayStr) {
                            exceptions.push({ ...exc, subject: s });
                        }
                    });
                }
            });
            
            if (daySubjects.length > 0 || exceptions.length > 0) {
                contentEl.createEl('h3', { text: day });
                
                daySubjects.sort((a, b) => (a[timeField] || '').localeCompare(b[timeField] || ''));
                
                daySubjects.forEach(subject => {
                    const div = contentEl.createDiv({ cls: 'schedule-item' });
                    div.createEl('strong', { text: `${subject[timeField] || 'No time'}` });
                    div.createEl('span', { text: ` - ${subject.name}` });
                    div.createEl('br');
                    div.createEl('small', { text: `Teacher: ${subject.teacher || 'N/A'} | Room: ${subject.room || 'N/A'}` });
                });
                
                // Show exceptions
                exceptions.forEach(exc => {
                    const div = contentEl.createDiv({ cls: 'schedule-item', attr: { style: 'background-color: var(--background-modifier-error-hover); padding: 5px; margin: 5px 0; border-radius: 3px;' } });
                    div.createEl('strong', { text: `⚠️ ${exc.time}` });
                    div.createEl('span', { text: ` - ${exc.subject.name} (Exception: ${exc.date})` });
                    div.createEl('br');
                    div.createEl('small', { text: `Teacher: ${exc.subject.teacher || 'N/A'} | Room: ${exc.subject.room || 'N/A'}` });
                });
            }
        });
        
        if (this.plugin.subjects.every(s => !s[dayField])) {
            contentEl.createEl('p', { text: 'No schedule available for this mode.' });
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

module.exports = class SubjectManagerPlugin extends Plugin {
    async onload() {
        await this.loadData();
        await this.loadSettings();

        this.addCommand({
            id: 'toggle-schedule',
            name: 'Toggle Schedule Mode',
            callback: async () => {
                this.scheduleMode = this.scheduleMode === 'Normal' ? 'Ramadan' : 'Normal';
                await this.saveSettings();
                new Notice(`Switched to ${this.scheduleMode} schedule`);
            }
        });

        this.addRibbonIcon('calendar', 'Toggle Schedule', async () => {
            this.scheduleMode = this.scheduleMode === 'Normal' ? 'Ramadan' : 'Normal';
            await this.saveSettings();
            new Notice(`Switched to ${this.scheduleMode} schedule`);
        });

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

        this.addCommand({
            id: 'view-schedule',
            name: 'View Schedule',
            callback: () => {
                new ScheduleViewModal(this.app, this).open();
            }
        });

        this.addRibbonIcon('calendar-clock', 'View Schedule', () => {
            new ScheduleViewModal(this.app, this).open();
        });

        this.addCommand({
            id: 'add-exception',
            name: 'Add Schedule Exception',
            callback: () => {
                new AddExceptionModal(this.app, this).open();
            }
        });

        this.addCommand({
            id: 'view-exceptions',
            name: 'View All Exceptions',
            callback: () => {
                new ViewExceptionsModal(this.app, this).open();
            }
        });

        this.addCommand({
            id: 'manage-exceptions',
            name: 'Edit/Delete Exceptions',
            callback: () => {
                new SelectExceptionModal(this.app, this).open();
            }
        });

        this.addCommand({
            id: 'create-note-from-exception',
            name: 'Create Note from Exception',
            callback: () => {
                new CreateNoteFromExceptionModal(this.app, this).open();
            }
        });
    }

    async loadSettings() {
        try {
            const data = await this.app.vault.adapter.read('.obsidian/plugins/subject-manager/data.json');
            this.scheduleMode = JSON.parse(data).scheduleMode || 'Normal';
        } catch {
            this.scheduleMode = 'Normal';
        }
    }

    async saveSettings() {
        await this.app.vault.adapter.write('.obsidian/plugins/subject-manager/data.json', JSON.stringify({ scheduleMode: this.scheduleMode }));
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
        const mode = this.scheduleMode;
        const field = mode === 'Ramadan' ? 'timeRamadan' : 'timeNormal';
        return [...new Set(this.subjects.map(s => s[field] || s.time).filter(Boolean))];
    }

    getTemplates() {
        const templatesFolder = this.app.vault.getAbstractFileByPath('Templates');
        if (!templatesFolder || !templatesFolder.children) return [];
        
        return templatesFolder.children
            .filter(file => file.extension === 'md')
            .map(file => file.basename);
    }

    async createSubject(number, name, teacher, module, room, dayNormal, timeNormal, dayRamadan, timeRamadan) {
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
                dayNormal: dayNormal || '',
                timeNormal: timeNormal || '',
                dayRamadan: dayRamadan || '',
                timeRamadan: timeRamadan || '',
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

    async editSubject(oldSubject, number, name, teacher, module, room, dayNormal, timeNormal, dayRamadan, timeRamadan) {
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
                    dayNormal: dayNormal || '',
                    timeNormal: timeNormal || '',
                    dayRamadan: dayRamadan || '',
                    timeRamadan: timeRamadan || ''
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
            
            let created = 0;
            
            // Create missing folders from JSON
            for (const subject of this.subjects) {
                if (!existingFolders.includes(subject.folderName)) {
                    await this.app.vault.createFolder(subject.folderName);
                    created++;
                }
            }
            
            new Notice(`Applied! Created: ${created}`);
        } catch (error) {
            new Notice(`Error: ${error.message}`);
        }
    }

    async addException(subject, date, day, time) {
        try {
            const index = this.subjects.findIndex(s => s.folderName === subject.folderName);
            if (index !== -1) {
                if (!this.subjects[index].exceptions) {
                    this.subjects[index].exceptions = [];
                }
                this.subjects[index].exceptions.push({
                    date,
                    day,
                    time,
                    subjectFolder: subject.folderName
                });
                await this.saveData();
                new Notice(`Exception added for ${subject.name} on ${date}`);
            }
        } catch (error) {
            new Notice(`Error: ${error.message}`);
        }
    }

    async editException(subject, index, date, day, time) {
        try {
            const subjectIndex = this.subjects.findIndex(s => s.folderName === subject.folderName);
            if (subjectIndex !== -1 && this.subjects[subjectIndex].exceptions) {
                this.subjects[subjectIndex].exceptions[index] = {
                    date,
                    day,
                    time,
                    subjectFolder: subject.folderName
                };
                await this.saveData();
                new Notice(`Exception updated for ${subject.name}`);
            }
        } catch (error) {
            new Notice(`Error: ${error.message}`);
        }
    }

    async deleteException(subject, index) {
        try {
            const subjectIndex = this.subjects.findIndex(s => s.folderName === subject.folderName);
            if (subjectIndex !== -1 && this.subjects[subjectIndex].exceptions) {
                this.subjects[subjectIndex].exceptions.splice(index, 1);
                await this.saveData();
                new Notice(`Exception deleted for ${subject.name}`);
            }
        } catch (error) {
            new Notice(`Error: ${error.message}`);
        }
    }

    async createNoteFromException(exception, templateName) {
        try {
            const subject = exception.subject;
            const templatePath = `Templates/${templateName}.md`;
            const templateFile = this.app.vault.getAbstractFileByPath(templatePath);
            
            if (!templateFile) {
                new Notice(`Template not found: ${templatePath}`);
                return;
            }
            
            let templateContent = await this.app.vault.read(templateFile);
            
            // Remove the template code block first
            templateContent = templateContent.replace(/<%\*[\s\S]*?%>/g, '');
            
            // Replace template variables with exception data
            const mode = this.scheduleMode;
            templateContent = templateContent.replace(/<% subject\?\.name \|\| '' %>/g, subject.name);
            templateContent = templateContent.replace(/<% subject\?\.teacher \|\| '' %>/g, subject.teacher || '');
            templateContent = templateContent.replace(/<% subject\?\.module \|\| '' %>/g, subject.module || '');
            templateContent = templateContent.replace(/<% subject\?\.room \|\| '' %>/g, subject.room || '');
            templateContent = templateContent.replace(/<% day \|\| '' %>/g, exception.day);
            templateContent = templateContent.replace(/<% time \|\| '' %>/g, exception.time);
            templateContent = templateContent.replace(/<% scheduleMode %>/g, `${mode} (Exception)`);
            templateContent = templateContent.replace(/<% tp\.date\.now\("YYYY-MM-DD"\) %>/g, exception.date);
            
            // Remove all remaining template syntax
            templateContent = templateContent.replace(/<%[^%]*%>/g, '');
            
            const fileName = `${exception.date}-${templateName.replace(/\s+/g, '-')}.md`;
            const filePath = `${subject.folderName}/${fileName}`;
            
            await this.app.vault.create(filePath, templateContent);
            
            const file = this.app.vault.getAbstractFileByPath(filePath);
            if (file) {
                await this.app.workspace.getLeaf().openFile(file);
            }
            
            new Notice(`Note created: ${fileName}`);
        } catch (error) {
            new Notice(`Error: ${error.message}`);
        }
    }
};
