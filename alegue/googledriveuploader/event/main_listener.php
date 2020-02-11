<?php
/**
 *
 * Google Drive uploader. An extension for the phpBB Forum Software package.
 *
 * @copyright (c) 2020, Alessio
 * @license GNU General Public License, version 2 (GPL-2.0)
 *
 */

namespace alegue\googledriveuploader\event;

/**
 * @ignore
 */
use Symfony\Component\EventDispatcher\EventSubscriberInterface;


require_once __DIR__."/../google_api/vendor/autoload.php";
use Google_Client;
use Google_Service_Drive;
use Google_Service_Drive_DriveFile;
//use Google_Auth_AssertionCredentials;
session_start();

/**
 * Google Drive uploader Event listener.
 */
class main_listener implements EventSubscriberInterface
{
	public static function getSubscribedEvents()
	{
		return array(
			'core.user_setup'							=> 'load_language_on_setup',
			//'core.display_forums_modify_template_vars'	=> 'display_forums_modify_template_vars',
			'core.posting_modify_template_vars' => 'load_googledrive_session_token'
		);
	}

	/* @var \phpbb\language\language */
	protected $language;

	/**
	 * Constructor
	 *
	 * @param \phpbb\language\language	$language	Language object
	 */
	public function __construct(\phpbb\language\language $language)
	{
		$this->language = $language;
	}

	/**
	 * Load common language files during user setup
	 *
	 * @param \phpbb\event\data	$event	Event object
	 */
	public function load_language_on_setup($event)
	{
		$lang_set_ext = $event['lang_set_ext'];
		$lang_set_ext[] = array(
			'ext_name' => 'alegue/googledriveuploader',
			'lang_set' => 'common',
		);
		$event['lang_set_ext'] = $lang_set_ext;
	}

	/**
	 * A sample PHP event
	 * Modifies the names of the forums on index
	 *
	 * @param \phpbb\event\data	$event	Event object
	 */
	public function display_forums_modify_template_vars($event)
	{
		$forum_row = $event['forum_row'];
		$forum_row['FORUM_NAME'] .= $this->language->lang('GOOGLEDRIVEUPLOADER_EVENT');
		$event['forum_row'] = $forum_row;
	}

	/**
	 * Google drive token loader
	 * 
	 *
	 * @param \phpbb\event\data	$event	Event object
	 */
	public function load_googledrive_session_token($event)
	{
		global $request; // the magic!
		$request->enable_super_globals();

		//$key_file_location = __DIR__."/../credentials.json";
		//putenv('GOOGLE_APPLICATION_CREDENTIALS='.$key_file_location);

		//$client_id = "997679047549-a2i4ao3kglcqfd9olfdc63eptba73qgu.apps.googleusercontent.com";
		//$email_address = "bioscambio.db@gmail.com";
		
		$client = new Google_Client();
		$client->setAuthConfig(__DIR__.'/../credentials.json');
		$client->addScope(Google_Service_Drive::DRIVE);
		//$client->useApplicationDefaultCredentials(); 
		error_log(print_r("token:" . $client->getAccessToken(), true));

		$service = new Google_Service_Drive($client);
		$fileMetadata = new Google_Service_Drive_DriveFile(array("name" => "files/smallfile.txt"));
		$file = $service->files->create(
			$fileMetadata,
			array(
				'data' => file_get_contents("/var/www/html/phpBB3/ext/alegue/googledriveuploader/event/smallfile.txt"),
				'mimeType' => 'application/octet-stream',
				'uploadType' => 'media'
			)
		);
		error_log(print_r("Id:". $file->getId(), true));
	}
}



