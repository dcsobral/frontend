Feature: Articles

In order to experience all the wonderful words the Guardian write
As a Guardian reader
I want to read a version of the article optimised for my mobile devices

Measurements
------------

- Page views should *not* decrease.
- Retain people on mobile (by reducing % of mobile traffic to www and clicks to the desktop site)

    Scenario: Article body components 
        Given I visit an article
        Then I see all the required body components  
    
    Scenario: Accessibility / SEO
        Given I visit an article
        Then it validates against the schema.org standards

    Scenario: Images in articles
        Given I visit an article containing several images 
        Then I see images and associated captions throughout the article

    Scenario: Link to desktop site 
        Given I visit an article
        Then I see a link to the corresponding desktop (www) article 

    Scenario: Article visit if tracked with Omniture
        Given I visit an article using a mobile device, tablet or desktop
        When I track my visit using omniture
        Then Omniture will display data showing my interaction with the article 

    @blocked
    Scenario: Image quality
        Given I am on a low bandwidth connection
            And I visit an article containing several images
        Then each image should be upgraded in quality
        
    @blocked
    Scenario: Different types of picture
        Given I visit an article containing a image of type 'infographic'

