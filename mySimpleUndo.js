(function (factory) {
	"use strict";
	if (typeof define === "function" && define.amd) { // AMD
		define(factory);
	} else if (typeof module === "object" && typeof module.exports === "object") { // Node CommonJS
		module.exports = factory();
	} else { // Browser
		factory();
	}
})((function (global) {
	"use strict";

	return function () {
		/**
		 * 重做撤销构造函数
		 */
        function Undo() {
			this.commands = [];
			this.index = -1;
        }

		/**
		 * 执行函数
		 * @param {Object} command [要执行的命令]
		 */
		Undo.prototype.execute = function (command) {
			this._clearRedo();
			this.commands.push(command);
			this.index++;
			this.update();
		};

		/**
		 * 撤销
		 */
		Undo.prototype.undo = function () {
			var command = this.commands[this.index--];
			command.undo();
			this.update();
		};

		/**
		 * 重做
		 */
		Undo.prototype.redo = function () {
			var command = this.commands[++this.index];
			command.redo();
			this.update();
		};

		/**
		 * 是否可撤销
		 */
		Undo.prototype.canUndo = function () {
			return this.index >= 0;
		};

		/**
		 * 是否可重做
		 */
		Undo.prototype.canRedo = function () {
			return this.index < this.commands.length - 1;
		};

		/**
		 * 清除无用的重做部分
		 */
		Undo.prototype._clearRedo = function () {
			this.commands.splice(this.index+1, this.commands.length);
		};

		Undo.prototype.update = function () {
			throw new Error("update is not defined!");
		};

		/**
		 * 命令构造函数
		 * @param {HTMLElement} el [编辑器元素]
		 */
		function Command(el, oldVal, newVal) {
			this.el = el;
			this.oldVal = el && oldVal;
			this.newVal = el && newVal;
			this.undo = function () {
				this.el.innerHTML = this.oldVal;
			};
			this.redo = function () {
				this.el.innerHTML = this.newVal;
			}
		}

		global.Undo = Undo;
		global.Command = Command;
    };
})(this))
