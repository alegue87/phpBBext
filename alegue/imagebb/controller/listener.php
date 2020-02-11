<?php
/**
 *
 * mediafire image uploader. An extension for the phpBB Forum Software package.
 *
 * @copyright (c) 2020, Alessio
 * @license GNU General Public License, version 2 (GPL-2.0)
 *
 */

namespace alegue\imagebb\controller;


use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class listener implements EventSubscriberInterface
{
	protected $template;

	public function __construct(\phpbb\template\template $template){
		$this->template = $template;
	}
	
    /**
     * Assign functions defined in this class to event listeners in the core
     *
     * @return array
     */
    static public function getSubscribedEvents()
    {
        return array(
			//'core.user_setup' => 'load_language_on_setup',
			//'core.posting_modify_template_vars' => 'load_mediafire_session_token'
        );
    }

    /**
     * Load the Acme Demo language file
     *     acme/demo/language/en/demo.php
     *
     * @param \phpbb\event\data $event The event object
     */
    public function load_language_on_setup($event)
    {
        $lang_set_ext = $event['lang_set_ext'];
        $lang_set_ext[] = array(
            'ext_name' => 'alegue/imagebb',
            'lang_set' => 'imagebb',
        );
        $event['lang_set_ext'] = $lang_set_ext;
	}
	
	public function load_mediafire_session_token($event)
    {   
        //$apiKey = "9d73931a6bca7fd08ca78d41617209b7";
        //$this->template->assign_var('S_IMAGEBB_API_KEY', $apiKey);
    }
}