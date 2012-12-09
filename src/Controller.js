/*global $:true, document:true, todo:true, _:true, window:true, Parse:true*/
(function() {
	"use strict";

	$(document).ready(function($scope) {
		Parse.initialize("hZcNJwOePbIsFdBcLfsBUQR21bD7AftCBFpUM4ha", "XBQnV4pQHNh9M8TvtaAYZHsqQd1yK3uhfuEp0VMw");
		new todo.Controller($scope);
	});

	todo.Controller = function($scope) {
		var TaskList = Parse.Object.extend("TaskList");
		var globalTaskList = new TaskList();
		var query = new Parse.Query(TaskList);

		$scope.taskList = [];

		//input a new task:

		$scope.addTask = function() {
			if(this.inputText) {
				this.taskList.push({
					text: this.inputText,
					done: false
				});
				this.inputText = "";
			}
			this.saveTasks();
		};

		//save or load a list:

		$scope.saveOrLoad = function() {
			if(this.taskListName) {
				query.matches("name", this.taskListName);
				query.find({
					success: function(newTaskList) {
						if(newTaskList.length > 0) {
							globalTaskList = newTaskList[0];
							$scope.updateTaskList();
							$("#addTask").click(); //another ugly hack... (to get the list to update)
						} else {
							$scope.saveTasks();
						}
					},
					error: function(error) {
						console.log("Error: " + error.code + " " + error.message);
					}
				});
			} else {
				alert("your list must have a name!");
			}
		};

		//archive:

		$scope.archive = function() {
			$(".ng-scope .done-true").fadeOut("slow");
			$(":checked").fadeOut("slow", function() {
				$scope.taskList = _.reject($scope.taskList, function(item) {
					return item.done;
				});
				$("#archive").click();	/*weird hack to get the "Todo: # of # items" to 
										update and reflect the new length of the array*/
			});
			this.saveTasks();
		};

		//others:

		$scope.getNumDone = function() {
			var count = 0;
			_.each(this.taskList, function(item) {
				count += item.done ? 0 : 1;
			});
			return count;
		};

		$scope.saveTasks = function() {
			var tasks = [];
			_.each($scope.taskList, function(obj) {
				tasks.push(_.values(obj));
			});
			globalTaskList.save({
				name: this.taskListName,
				notCompleted: tasks
			});
		};

		$scope.updateTaskList = function() {
			this.taskList = [];
			_.each(globalTaskList.get("notCompleted"), function(task) {
				$scope.taskList.push({text: task[0], done: task[1]})
			});
		}

	};
}());