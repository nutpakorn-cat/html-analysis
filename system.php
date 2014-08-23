<?php
/*
SYSTEM : HTMLAnalysis
VERSION : 1.0 DEV
AUTHOR : NUTTER ROCKER(TWICEWORLD PHP)
FILE : System.php
!!!TO RUN THIS FILE!!!
1.Open cmd.
2.Select this directory with cd example cd C:\xampp\htdocs\HTMLAnalysis
3.Run this file (use command php system.php)
4.Insert your html link
*/
/* Download */
function download_remote($url , $save_path)
{
    $f = fopen( $save_path , 'w+');
     
    $handle = fopen($url , "rb");
     
    while (!feof($handle)) 
    {
        $contents = fread($handle, 8192);
        fwrite($f , $contents);
    }
     
    fclose($handle);
    fclose($f);
}
/* Variable */
date_default_timezone_set('UTC');
$data['lib'] = "lib";
$data['ds'] = DIRECTORY_SEPARATOR;
/* Scanf */
function scanf() //Get input
{
    $handle = fopen ("php://stdin","r");
    return fgets($handle);
}
echo "[HTMLAnalysis Version : 1.0]\n";
echo "[INSERT YOUR LINK WITH / IN LAST CHARACTER]\n";
$data['link'] = trim(scanf()); //Get input.
echo "[INSERT YOUR PROJECT NAME]\n";
$data['project_name'] = str_replace(" ","_",trim(scanf())); //Get input.
echo "[ENABLE LOG?] Y = yes n = no\n";
$data['log'] = trim(scanf()); //Get input.

/* Process Zone */
include_once $data['lib'] . $data['ds'] . "dom" . $data['ds'] . "simple_html_dom.php"; //Include DOM system lib
if(mkdir("output" . $data['ds'] . $data['project_name']))
{
    if($data['log'] == "Y")
    {
        echo "[LOG][" . date('Y-m-d H:i:s') . "] Create folder in output name {$data['project_name']}.\n";   
    }   
}
if(mkdir("output" . $data['ds'] . $data['project_name'] . $data['ds'] . "assets"))
{
    if($data['log'] == "Y")
    {
        echo "[LOG][" . date('Y-m-d H:i:s') . "] Create assets folder in output/{$data['project_name']}.\n";   
    }   
}
if(mkdir("output" . $data['ds'] . $data['project_name'] . $data['ds'] . "assets" . $data['ds'] . "css"))
{
    if($data['log'] == "Y")
    {
        echo "[LOG][" . date('Y-m-d H:i:s') . "] Create css folder in output/{$data['project_name']}/assets.\n";   
    }   
}
if(mkdir("output" . $data['ds'] . $data['project_name'] . $data['ds'] . "assets" . $data['ds'] . "js"))
{
    if($data['log'] == "Y")
    {
        echo "[LOG][" . date('Y-m-d H:i:s') . "] Create js folder in output/{$data['project_name']}/assets.\n";   
    }   
}
if(mkdir("output" . $data['ds'] . $data['project_name'] . $data['ds'] . "assets" . $data['ds'] . "img"))
{
    if($data['log'] == "Y")
    {
        echo "[LOG][" . date('Y-m-d H:i:s') . "] Create img folder in output/{$data['project_name']}/assets.\n";   
    }   
}
//Create DOM from URL or file
$link = array(); //link css
$o_link = array(); //old css
$css = array(); //css_file
$img = array(); //link img
$o_img = array(); //old img
$img_master = array(); //img file
$javascript = array(); //javascript
$o_javascript = array(); //old js
$js = array(); //js_file
$html = file_get_html($data['link']);
foreach($html->find("link") as $element) //Get all link from html
{
    if($data['log'] == "Y")
    {
        echo "[LOG][" . date('Y-m-d H:i:s') . "] Get INCLUDE Link.\n";   
    }
    $link[] = $element->href;
}
foreach($html->find("script") as $element) //Get all javascript include from html
{
    if($data['log'] == "Y")
    {
        echo "[LOG][" . date('Y-m-d H:i:s') . "] Get INCLUDE JAVASCRIPT.\n";   
    }
    $javascript[] = $element->src;
}
foreach($html->find("img") as $element) //Get all img include from html
{
    if($data['log'] == "Y")
    {
        echo "[LOG][" . date('Y-m-d H:i:s') . "] Get Images.\n";   
    }
    $img[] = $element->src;
}
foreach($link as $id => $value) //Convert all link in HTTP
{
    $o_link[] = $value;
    if(substr($value,0,4) != "http" || substr($value,0,2) != "//")
    {
        $link[$id] = $data['link'] . $value;   
        if($data['log'] == "Y")
        {
            echo "[LOG][" . date('Y-m-d H:i:s') . "][LINK_CSS] Convert $value to {$link[$id]} .\n";   
        }
    }
}
foreach($javascript as $id => $value) //Convert all javascript link in HTTP
{
    $o_javascript[] = $value;
    if(substr($value,0,4) != "http" || substr($value,0,2) != "//")
    {
        $javascript[$id] = $data['link'] . $value;   
        if($data['log'] == "Y")
        {
            echo "[LOG][" . date('Y-m-d H:i:s') . "][JAVASCRIPT] Convert $value to {$javascript[$id]} .\n";   
        }
    }
}
foreach($img as $id => $value) //Convert all javascript link in HTTP
{
    $o_img[] = $value;
    if(substr($value,0,4) != "http" || substr($value,0,2) != "//")
    {
        $img[$id] = $data['link'] . $value;   
        if($data['log'] == "Y")
        {
            echo "[LOG][" . date('Y-m-d H:i:s') . "][IMG] Convert $value to {$img[$id]} .\n";   
        }
    }
}
/* Download Content */
/* CSS */
function clean($string) { //Clean file name
   $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.

   return preg_replace('/[^A-Za-z0-9.\-]/', '', $string); // Removes special chars.
}
foreach($link as $id => $value)
{
    $file = explode("/",$value);
    $file_name = clean($file[count($file) - 1]);
    if(count(explode(".",$file_name)) == 1)
    {
        $file_name .= ".css";
    }
    $css[] = $file_name;
    download_remote($value,"output/" . $data['project_name'] . "/assets/css/$file_name");
    if($data['log'] == "Y")
    {
        echo "[LOG][" . date('Y-m-d H:i:s') . "][CSS] Download complete! $file_name.\n";   
    }
}
foreach($javascript as $id => $value)
{
    $file = explode("/",$value);
    $file_name = clean($file[count($file) - 1]);
    if(count(explode(".",$file_name)) == 1)
    {
        $file_name .= ".js";
    }
    $js[] = $file_name;
    download_remote($value,"output/" . $data['project_name'] . "/assets/js/$file_name");
    if($data['log'] == "Y")
    {
        echo "[LOG][" . date('Y-m-d H:i:s') . "][JAVASCRIPT] Download complete! $file_name.\n";   
    }
}
foreach($img as $id => $value)
{
    $file = explode("/",$value);
    $file_name = clean($file[count($file) - 1]);
    if(count(explode(".",$file_name)) == 1)
    {
        $file_name .= ".png";
    }
    $img_master[] = $file_name;
    download_remote($value,"output/" . $data['project_name'] . "/assets/img/$file_name");
    if($data['log'] == "Y")
    {
        echo "[LOG][" . date('Y-m-d H:i:s') . "][IMG] Download complete! $file_name.\n";   
    }
}
/*
[Convert HTMl]
*/
$code = file_get_contents($data['link']);
foreach($o_link as $id => $value)
{
    $code = str_ireplace($value,"assets/css/".$css[$id],$code);
    if($data['log'] == "Y")
    {
        echo "[LOG][" . date('Y-m-d H:i:s') . "][CSS] Update HTML $value to {$css[$id]}.\n";   
    }
}
foreach($o_javascript as $id => $value)
{
    $code = str_ireplace($value,"assets/js/".$js[$id],$code);
    if($data['log'] == "Y")
    {
        echo "[LOG][" . date('Y-m-d H:i:s') . "][JS] Update HTML $value to {$js[$id]}.\n";   
    }
}
foreach($o_img as $id => $value)
{
    $code = str_ireplace($value,"assets/img/".$img_master[$id],$code);
    if($data['log'] == "Y")
    {
        echo "[LOG][" . date('Y-m-d H:i:s') . "][IMG] Update HTML $value to {$img_master[$id]}.\n";   
    }
}
$open = fopen("output/{$data['project_name']}/index.html","w+");
$write = fwrite($open,$code);
echo "SUCCESS!";