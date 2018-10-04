# Facebook Specific Setup

On Windows, use git bash not powershell.  Ubuntu and Mac you are fine with terminal.

## Greetings Text

```
curl -X POST -H "Content-Type: application/json" -d '{
  "greeting":[
    {
      "locale":"default",
      "text":"Hello {{user_first_name}}!"
    }, {
      "locale":"en_US",
      "text":"Hello {{user_first_name}}!\u000a\u000aThis is the US greetings text."
    }
  ] 
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=FB_PAGE_ACCESS_TOKEN"  

```

## Get Started Button

```
curl -X POST -H "Content-Type: application/json" -d '{ 
  "get_started":{
    "payload":"welcomeIntent"
  }
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=FB_PAGE_ACCESS_TOKEN"

```


## Persistent Menu

```

curl -X POST -H "Content-Type: application/json" -d '{
  "persistent_menu":[
    {
      "locale":"default",
      "composer_input_disabled":false,
      "call_to_actions":[
        {
          "type":"postback",
          "title":"Demo A",
          "payload":"demoA"
        },
        {
          "type":"postback",
          "title":"Demo B",
          "payload":"demoB"
        },
        {
          "type":"postback",
          "title":"Demo C",
          "payload":"demoC"
        }
        
      ]
    }
  ]
}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=FB_PAGE_ACCESS_TOKEN"




```

The persistent menu does have more options like creating custom versions of the menu for different locales, disabling composer for some locales but not others, not having a menu for some locales (just pass an empty array to the call_to_actions for that locale), passing web_urls for buttons, etc.

Look at https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api/persistent-menu for more information