module.exports = {
    rules: {
        "non-encoded": {
            meta: {
                messages: {
                    encodeForHTMLAttribute : "[Attr Enconding Missing] HTML Attribute needs to be encoded using function SdpEncoder.encodeForHTMLAttribute",
                    encodeForHTML : "[Element Encoding Missing] HTML String should be encoded using function SdpEncoder.encodeForHTML"
                }
            },
            create: function(context) {
                //To get all comments in a file and we filter the line number where '//no-encoding' comments is used. 
                var comments = context.getAllComments();
                var line_nos = comments.filter(function(c){
                    if(c.type === "Line" && c.value.toLowerCase().includes("no-encoding")){
                        return c;
                    }
                }).map( function(c){
                    return c.loc.start.line;
                });
                return {
                    BinaryExpression(node) {
                        //If "//no-encoding" comment is added, no need to check for encoding.
                        if(line_nos.includes(node.loc.end.line) || line_nos.includes(node.loc.start.line)) return;
                        // HTML;
                        // Error Case: var htmlStr = "<div></div>" + str;
                        // Correct Case: var htmlStr = "<div></div>" + SdpEncoder.encodeForHTML(str);
                        if (node.left.type === 'Literal') {
                            var nodeLeftValue = String(node.left.value);
                            if (nodeLeftValue.trim().endsWith(">")){
                                if(node.right.type == "CallExpression"){
                                    if(node.right.callee.type == "MemberExpression") {
                                        var calleeObjectName = String(node.right.callee.object.name);
                                        var calleePropertyName = String(node.right.callee.property.name);
                                        if(calleeObjectName != "SdpEncoder" || calleePropertyName != "encodeForHTML"){
                                            throwError("encodeForHTML");
                                        }
                                    }
                                    if(node.right.callee.type == "Identifier"){
                                        //Check for already encoded or not
                                        if(!(node.right.callee.name == "ashtmlString") ){
                                            throwError("encodeForHTML");
                                        }
                                    } 
                                }
                                if ( (node.right.type == "Identifier") || (node.right.type == "MemberExpression") ){
                                    throwError("encodeForHTML");
                                }
                            }
                        }
                        //HTML
                        // Error Case: var htmlStr = str + "<div></div>";
                        // Correct Case: var htmlStr = SdpEncoder.encodeForHTML(str) + "<div></div>";
                        if (node.right.type === 'Literal') {
                            var nodeRightType = String(node.right.value);
                            if (nodeRightType.trim().startsWith("<")){
                                if(node.left.type == "CallExpression") {
                                    if(node.left.callee.type=="MemberExpression") {
                                        var calleeObjectName = String(node.left.callee.object.name);
                                        var calleePropertyName = String(node.left.callee.property.name);
                                        if(calleeObjectName != "SdpEncoder" || calleePropertyName != "encodeForHTML"){
                                            throwError("encodeForHTML");
                                        }
                                    }
                                    if(node.left.callee.type =="Identifier") { 
                                        //Check for already encoded or not
                                        if(!(node.left.callee.name == "ashtmlString") ){
                                            throwError("encodeForHTML");
                                        }
                                    }
                                }
                                if ( (node.left.type == "Identifier") || (node.left.type == "MemberExpression") ) {
                                    throwError("encodeForHTML");
                                }
                            }
                        }
                        //Attr
                        // Error Case: var htmlStr = "<div title='"+ str +"'></div>"
                        // Correct Case: var htmlStr = "<div title='"+ SdpEncoder.encodeForHTMLAttribute(str) +"'></div>"
                        if (node.left.type === 'Literal') {
                            var nodeLeftValue = String(node.left.value);
                            if( (nodeLeftValue.trim().endsWith("=") || nodeLeftValue.trim().endsWith("='") || nodeLeftValue.trim().endsWith("= '") || nodeLeftValue.trim().endsWith("=\"") || nodeLeftValue.trim().endsWith("= \"")) 
                                && !(nodeLeftValue.trim().includes("[")) ){
                                if(node.right.type == "CallExpression"){
                                    if(node.right.callee.type == "MemberExpression") {
                                        var calleeObjectName = String(node.right.callee.object.name);
                                        var calleePropertyName = String(node.right.callee.property.name);
                                        if(calleeObjectName != "SdpEncoder" || calleePropertyName != "encodeForHTMLAttribute"){
                                            throwError("encodeForHTMLAttribute");
                                        }
                                    }
                                    if(node.right.callee.type == "Identifier"){
                                        if((node.right.callee.name == "encodeHtmlAttribute") && (node.right.arguments.length == 1) && (node.right.arguments[0].type == "CallExpression") 
                                            && (node.right.arguments[0].callee.name == "ashtmlString") ){
                                                //do nothing
                                        }else{
                                            throwError("encodeForHTMLAttribute");
                                        }
                                    }
                                }
                                if( (node.right.type == "Identifier") || (node.right.type == "MemberExpression") ){
                                    throwError("encodeForHTMLAttribute");
                                }
                            }
                        }
                        function throwError(message){
                            context.report({
                                node,
                                messageId: message,
                            });
                        }
                    }
                };
            }
        }
    }
};
