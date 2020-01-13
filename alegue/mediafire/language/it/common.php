<?php
/** 
* 
* @package Micogian - Readers
* @copyright (c) 2018 Micogian
* @license http://opensource.org/licenses/gpl-2.0.php GNU General Public License v2 
* 
*/ 
if (!defined('IN_PHPBB'))
{
	exit;
}
if (empty($lang) || !is_array($lang))
{
	$lang = array();
}
$lang = array_merge($lang, array(
	'READERS_1'			=> 'lettore',
	'READERS_2'			=> 'lettori',
));