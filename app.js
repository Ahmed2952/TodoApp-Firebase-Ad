var firebaseConfig = {
    apiKey: "AIzaSyD8Mo_FtHtCJ7WXZIZhbyFHp5MGRMk2FSs",
    authDomain: "todoapp-8e44a.firebaseapp.com",
    projectId: "todoapp-8e44a",
    storageBucket: "todoapp-8e44a.appspot.com",
    messagingSenderId: "7212650044",
    appId: "1:7212650044:web:3ae4f21db0fb17263cbd39"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  var database = firebase.database();
  var tasksRef = database.ref("Tasks");
  
  var list = document.getElementById("list");
  
  function addTodo() {
    var todo_item = document.getElementById("todo-item");
    var todoText = todo_item.value.trim();
  
    if (todoText !== "") {
      var newTaskRef = tasksRef.push();
      newTaskRef.set({
        taskName: todoText
      });
  
      var taskId = newTaskRef.key;
  
      // create li tag with text node and unique id
      var li = document.createElement("li");
      li.setAttribute("id", taskId);
      var liText = document.createTextNode(todoText);
      li.appendChild(liText);
  
      // create delete button
      var delBtn = document.createElement("button");
      var delText = document.createTextNode("DELETE");
      delBtn.setAttribute("class", "btn");
      delBtn.setAttribute("onclick", "deleteItem(this)");
      delBtn.setAttribute("data-id", taskId);
      delBtn.appendChild(delText);
  
      // create edit button
      var editBtn = document.createElement("button");
      var editText = document.createTextNode("EDIT");
      editBtn.appendChild(editText);
      editBtn.setAttribute("onclick", "editItem(this)");
      editBtn.setAttribute("data-id", taskId);
  
      li.appendChild(delBtn);
      li.appendChild(editBtn);
  
      list.appendChild(li);
  
      todo_item.value = "";
    }
  }
  
  function deleteItem(e) {
    var taskId = e.getAttribute("data-id");
  
    // Remove task from the Firebase Realtime Database
    tasksRef.child(taskId).remove();
  
    // Remove task from the HTML list
    e.parentNode.remove();
  }
  
  function editItem(e) {
    var taskId = e.getAttribute("data-id");
    var li = document.getElementById(taskId);
  
    var updatedText = prompt("Enter updated task:");
  
    if (updatedText !== null && updatedText.trim() !== "") {
      // Update task in the Firebase Realtime Database
      tasksRef.child(taskId).update({
        taskName: updatedText
      });
  
      // Update task in the HTML list
      li.firstChild.nodeValue = updatedText;
    }
  }
  
  tasksRef.on("child_added", function(snapshot) {
    var taskId = snapshot.key;
    var taskName = snapshot.val().taskName;
  
    // Check if task already exists in the list
    if (document.getElementById(taskId)) {
      return; // Skip adding the task again
    }
  
    var li = document.createElement("li");
    li.setAttribute("id", taskId);
    var liText = document.createTextNode(taskName);
    li.appendChild(liText);
  
    var delBtn = document.createElement("button");
    var delText = document.createTextNode("DELETE");
    delBtn.setAttribute("class", "btn");
    delBtn.setAttribute("onclick", "deleteItem(this)");
    delBtn.setAttribute("data-id", taskId);
    delBtn.appendChild(delText);
  
    var editBtn = document.createElement("button");
    var editText = document.createTextNode("EDIT");
    editBtn.appendChild(editText);
    editBtn.setAttribute("onclick", "editItem(this)");
    editBtn.setAttribute("data-id", taskId);
  
    li.appendChild(delBtn);
    li.appendChild(editBtn);
  
    list.appendChild(li);
  });
  
  
  
  tasksRef.on("child_removed", function (snapshot) {
    var taskId = snapshot.key;
    var li = document.getElementById(taskId);
    li.remove();
  });
  
  function deleteAll() {
    list.innerHTML = ""
  }