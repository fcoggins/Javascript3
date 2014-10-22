$(document).ready(function () {
    // Normally, JavaScript runs code at the time that the <script>
    // tags loads the JS. By putting this inside a jQuery $(document).ready()
    // function, this code only gets run when the document finishing loading.

    //setInterval(function () {alert("Hello")}, 3000);
    $("#message-form").submit(handleFormSubmit);
    
    getMessages();
    $("#message-send").prop('disabled', false);
    $("#message-send").click(function() {
                                        var message_send =  $(this);
                                        message_send.prop('disabled', true);
                                        setTimeout(function() {
                                            message_send.prop('disabled', false);
                                                              }, 5000);

                                        }
                                    );
    $("#message-clear").click(
                              function(
                                ){
                                   handleFormClear();
                                 }
                             );
});


/**
 * Handle submission of the form.
 */
function handleFormSubmit(evt) {
    evt.preventDefault();

    var textArea = $("#message");
    var msg = textArea.val();

    console.log("handleFormSubmit: ", msg);
    addMessage(msg);

    // Reset the message container to be empty
    textArea.val("");
}


/**
 * Clear our messages  
 */
function handleFormClear() {
    console.log(" before clear ");
    //var textArea = $("#message");
    //var msg = textArea.val();
    clearMessages();
    console.log("handleFormClear: ", "Hello Clear");
    //addMessage(msg);

    // Reset the message container to be empty
    //textArea.val("");
}


/**
 * Makes AJAX call to the server and the message to it.
 */
function addMessage(msg) {
    $.post(
        "/api/wall/add",
        {'m': msg},
        function (data) {
            console.log("addMessage: ", data);
            displayResultStatus(data.result);
            getMessages();
        }
    );
}

function formatNewMessages(results) {
    //loop over things in messages
    // create html to populate a table
    //<li class="list-group-item">Placeholder message #1</li>
    var msgs = results["messages"];
    var new_msg_list_html = "";
    for (var i = 0; i < msgs.length; i++){
        new_msg_list_html +='<li class="list-group-item">' + msgs[i]['message'] + '</li>';
    }
    return new_msg_list_html;
}

function getMessages() {
    // AJAX call here to /api/wall/list
    // when you get that list, find the part on the HTML page where you should put in the messages
    // loop over the messages you get from your ajax call, creating a <li>..</li> for each one
    //""" $.get(url, seccess-function); """

    $.get(
        "/api/wall/list",
        function(results) {
            new_msg_list_html = formatNewMessages(results);
            $("#message-container").empty().html(new_msg_list_html);
                    }
         );

}

function clearMessages() {
    // AJAX call here to /api/wall/list
    // when you get that list, find the part on the HTML page where you should put in the messages
    // loop over the messages you get from your ajax call, creating a <li>..</li> for each one
    //""" $.get(url, seccess-function); """
    console.log("in the clear message function");
    //When you click the clear button clear message container.


    $.get(
        "/api/wall/list",
        function(results) {
            // call function to save the first message in the 
            //   message container
            $("#message-container").empty();
                    }
         );

    $.get(
        "/api/default/wall/list",
        function(results) {
            // call function to save the first message in the 
            //   message container
            console.log(results);
            var message = results[0]['message'];
            default_msg = "<li class='list-group-item'> " + message + " </li>";
            $("#message-container").html(default_msg);
                    }
         );
}

/**
 * This is a helper function that does nothing but show a section of the
 * site (the message result) and then hide it a moment later.
 */
function displayResultStatus(resultMsg) {
    var notificationArea = $("#sent-result");
    notificationArea.text(resultMsg);
    notificationArea.slideDown(function () {
        // In JavaScript, "this" is a keyword that means "the object this
        // method or function is called on"; it is analogous to Python's
        // "self". In our case, "this" is the #sent-results element, which
        // is what slideDown was called on.
        //
        // However, when setTimeout is called, it won't be called on that
        // same #sent-results element--"this", for it, wouldn't be that
        // element. We could put inside of our setTimeout call the code
        // to re-find the #sent-results element, but that would be a bit
        // inelegant. Instead, we'll use a common JS idiom, to set a variable
        // to the *current* definition of self, here in this outer function,
        // so that the inner function can find it and where it will have the
        // same value. When stashing "this" into a new variable like that,
        // many JS programmers use the name "self"; some others use "that".
        var self = this;

        setTimeout(function () {
            $(self).slideUp();
        }, 2000);
    });
}