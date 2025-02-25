import { Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {

	statusBarTextElement: HTMLSpanElement;

	onload() {
		console.log('Loaded plugin.');
		
		this.statusBarTextElement = this.addStatusBarItem().createEl('span');
		this.readActiveFileAndUpdateLineCount();

		this.app.workspace.on('active-leaf-change', async () => {  // this calls the enclosure when the active-leaf-change event is triggered

			this.readActiveFileAndUpdateLineCount();
		})

		this.app.workspace.on('editor-change', editor => {  // triggered when the editor is changed.
			const content = editor.getDoc().getValue();
			this.updateLineCount(content);
		})

		
	}

	onunload(): void {
		console.log('Unloaded plugin.')
	}

	private updateLineCount(fileContent?: string) {
		const count = fileContent ? fileContent.split(/\r\n|\r|\n/).length : 0;  // splits the file contents into an array using carriage returns and then counts the number of entities in the array
		const linesWord = count === 1 ? "line" : "lines";
		this.statusBarTextElement.textContent = `${count} ${linesWord}`;

	}

	private async readActiveFileAndUpdateLineCount() {
		const file = this.app.workspace.getActiveFile();
		if (file) {
			const content = await this.app.vault.read(file);  // this promises something, which means it accesses it asynchronously. This method thus needs to happen asynchronously.
			this.updateLineCount(content);
		} else {
			this.updateLineCount(undefined);
		}
	}
}