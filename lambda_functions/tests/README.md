# Lambda Event Tests

This folder has a bunch of event tests that can be used for this bot.  Some errors are actually normal with these tests.  For example if you get:

```
{
    "error": {
        "message": "(#100) Param recipient[id] must be a valid ID string (e.g., \"123\")",
        "type": "OAuthException",
        "code": 100,
        "fbtrace_id": "DMwPPB9JFIT"
    }
}

```

sent back from Facebook after running a test, that is fine.  This is because we use fake sender & recipient ids for event tests.