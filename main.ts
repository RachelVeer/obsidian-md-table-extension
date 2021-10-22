import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, moment  } from 'obsidian';

"use strict";
 	function changeAll() {
 		wrapSpan(
 			document.getElementsByTagName('body')[0], 0
 		);
 	}

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

        console.log('loading plugin');

        const item = this.addStatusBarItem();
        item.createEl("span", { text: "Hello from the status bar 😎"});

		// This creates an icon in the left ribbon.
		let ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('Welcome, Mavera extends its greetings!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		let statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		//this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
        
        changeAll();

        /* Not entirely sure... */
        this.registerEvent(this.app.vault.on('modify', () => {
            changeAll();
        }));

        /* Opening a new file. */
        this.registerEvent(this.app.workspace.on('file-open', () => {
            changeAll();
        }));

        /* After editing a file (preview-mode). */
        this.registerEvent(this.app.metadataCache.on('resolved', () => {
            changeAll();
        }))
    }

	onunload() {
        console.log('unloading plugin')
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

/**  Code from: https://gist.github.com/RachelVeer/a6f7104e03c8f389c197705a8573f913
 	 * Wrap a span element around all text nodes.
 	 **/
 function wrapSpan(node: any, index: number) {
    if(node.nodeName === '#text') {
        var text = node.textContent;
        var s = document.createElement('span');

        s.textContent = text;
        node.parentElement.insertBefore(s, node.parentElement.childNodes[index]);
        node.remove();
        
    } else {
        var length = node.childNodes.length;
        // childNodes is a collection, not an array. :-/
        for(var i = 0; i < length; i++)
            wrapSpan(node.childNodes[i], i);
    }
}