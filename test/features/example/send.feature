@Example @Contact @ContactSend
Feature: Ability to send a contact message

  Scenario: Sending a message via the contact endpoint
    When I make an empty POST request to the API endpoint "/example/contact" as "contact"
    Then there should be a 400 error from the "contact" request that contains:
      | message           | detail                                                      |
      | Validation failed | ["fullName required", "email required", "message required"] |

  Scenario: Sending a message via the contact endpoint
    Given there is a POST consumer at "https://email.eu-west-1.amazonaws.com" that will return status 200
    When I make a POST request to the API endpoint "/example/contact" as "contact" using:
      | fullName   | email                     | message           |
      | John Smith | john.smith@example.com | Automated message |
    Then the status returned from the "contact" request should be 202

  Scenario: Sending a message via the contact endpoint
    Given there is a POST consumer at "https://email.eu-west-1.amazonaws.com" that will return "aws/ses-failure.xml" with status 400
    When I make a POST request to the API endpoint "/example/contact" as "contact" using:
      | fullName   | email                     | message           |
      | John Smith | john.smith@example.com | Automated message |
    Then there should be a 503 error from the "contact" request that contains:
      | message           | detail |
      | Third party error | []     |
