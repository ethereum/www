<?php
$name = $_POST['name'];
$email = $_POST['email'];
$compagny = $_POST['compagny'];
$message = $_POST['message'];

//Validate first
if(empty($name)||empty($email)||empty($message)) 
{
    echo "Name and email and message are required !";
    header('Location: index.html');
}
//validate against any email injection attempts
if(IsInjected($email))
{
    echo "Bad email value!";
    header('Location: index.html');
}


$msg =  " Name : $name \r\n"; 
$msg .= " Email: $email \r\n";
$msg .= " Company: $company \r\n";
$msg .= " Message : ".stripslashes($_POST['message'])."\r\n\n";
$msg .= "User information \r\n"; 
$msg .= "User IP : ".$_SERVER["REMOTE_ADDR"]."\r\n"; 
$msg .= "Browser info : ".$_SERVER["HTTP_USER_AGENT"]."\r\n"; 
$msg .= "User come from : ".$_SERVER["SERVER_NAME"];

$recipient = "info@ethereum.org";// Change the recipient email adress to your adrees  
$sujet =  "Sender information";
$mailheaders = "From: $email\r\nReply-To: $email\r\nReturn-Path: $email\r\n";
$ok = mail($recipient, $sujet, $msg, $mailheaders);

if(isset($ok)){
	header('Location: index.html');	
}else if(! isset($ok)){
	echo "Name and email are required !";
    header('Location: index.html');
}


// Function to validate against any email injection attempts
function IsInjected($str)
{
  $injections = array('(\n+)',
              '(\r+)',
              '(\t+)',
              '(%0A+)',
              '(%0D+)',
              '(%08+)',
              '(%09+)'
              );
  $inject = join('|', $injections);
  $inject = "/$inject/i";
  if(preg_match($inject,$str))
    {
    return true;
  }
  else
    {
    return false;
  }
}
   
?> 
