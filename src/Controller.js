/*global $:true, document:true, todo:true, _:true, window:true*/
(function() {
	"use strict";

	$(document).ready(function($scope) {
		new todo.Controller($scope);
	});

	todo.Controller = function($scope) {
		
		$scope.todoList = [];

		$scope.addTodo = function() {
			if(this.inputText) {
				this.todoList.push({text:this.inputText, done:false});
				this.inputText = "";
			}
		};

		$scope.getNumDone = function() {
			var count = 0;
			_.each(this.todoList, function(item) {
				count += item.done ? 0 : 1;
			});
			return count;
		};

		$scope.archive = function() {
			$(".ng-scope .done-true").fadeOut("slow");
			$(":checked").fadeOut("slow", function() {
				$scope.todoList = _.reject($scope.todoList, function(item) {
					return item.done;
				});
				$("#archive").click(); /*weird hack to get the "Todo: # of # items" to 
										update and reflect the new length of the array*/
			});
		};

		$("#input").keydown(function(e) {
			if(e.keyCode === 13) {
				$("#add").click();
			}
		});

	};
}());