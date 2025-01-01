To do:

- implement in liked events and upcoming events a max diplay page and automaic rendering when scrolling down

WHATS DONE IN VERSIONS

v 0.1.90

- implemented tabs in MyEvents to display either past, upcoming or all events user created

v 0.1.89

- adapted some styling in navbar elements

v 0.1.88

- created StylesSearch to filster for a specific style from the selected genres

v 0.1.87

- some skeletons adapted

v 0.1.86

- icons in menu sheet also for register login and logout

v 0.1.85

- Eslint rule for <img> off
- pathname in followToggleForm has fallback path
-

v 0.1.84

- now sheet menu with icons instead of dropdown menu

v 0.1.83

- now all booking and review code removed from app!
- amdin route now displays event information

v 0.1.82

- removed all review and booking code except for the admin route and the stats server actions

v 0.1.81

- updated MultipleDeleteEvents.tsx (type error)
- also removed bookings and reviews in prisma schema

v 0.1.80

- my-events table has now a select option and deleteMultipleEventsAction got intruduced
  - also implemented sorting feature for the table
- the genresselected font got updated to font-antonio
- font for Counterinput description modified to font-mono
- font for StylesInput description modified to font-mono
- adapted LoadingCards

v 0.1.79

- modified ui for month view for all screen sizes.
  - css classes set to achieve the necessary detailes adaptions
  - now always displaying 7 week days in month view.
  - the hover displaying varies regarding the day week or month view

v 0.1.78

- added email, website, phone and socialMedia details to organizerForm
  - added the values to the Event Slug / OrganizerCard
  - modified some styles in Event slug
- modified the FormInput to acept maxChar prop and value in order to give a visual feedback for max character which is set for slogan now! also adapted in schemas.ts
- some style adaption for the descriptions in FormInput and other location for Organizer

v 0.1.77

- modified skeletons for all routes

v 0.1.76

- selected Genres in genreDropdown now appear in navbar as badges
- GenresDropdown now displays different message
  - text color is more geayish
- LoadingCards for Calendar is updated to current month view with 7 daycards

v 0.1.75

- modified the dimensions of DayCard in week and day view.
- now 7 daycards fit in xl screen and it has fixed weekdays positions
  - days from previous month appear if there is the space for it but they are greyed out a bit

v 0.1.74

- changed price in EventCardProps to string instead of null
- changed the font in genresDropdown
-

- tailwind css prettier plugin works again. a prettier setting was not set correctly

v 0.1.73

- added components TitleHOne, TitleHTwo, TitleHThree and TitleHFour and replaced them in createEvent and event slug
- added font-antonio from google fonts and display it in forms.
- also some small other style adaptions

v 0.1.72

- you cant deselect the last genre once one is selected aynmore --> Alert Dialog gets dispayed
- removed the currency helper function myEvent list
- added currency-codes library to display automated currency depending on the country that is selected in location
  therefore i added also in Event Model a currency field in prisma schema and in schemas

v 0.1.71

- padding in CalendarToggleBtn removed
- Price is now a string and can be also free or donation
  - no seperate input anymore
  - schema and prisma schema updated accordingly

v 0.1.70

- imageContainer in event slug is not using Image Component anymore
- updated the Genre and StylesInput used in create and edit Event. Now it works properly and can display the stored values
  - removed useGenreStyles (not in use aynmore)
- - added to the required fields in createEvent components.
- added contactEmail, contactPhone, contactWebsite and contactSocialMedia to Organizer modal and schema
- added ticketLink to Event modal and Schema and updated the create and update event Action
  - added to the event slug in HeaderSection
- Tooltips for all elements in HeaderSection of event slug

v 0.1.69

- integrated Anton google Font for displaying name of the event in event slug

v 0.1.68

- corrected DayCard hover effects in Day view

v 0.1.67

- in OrganizerCard now we display how many events the organizer has created.
- also we display now how many days to go to the event in QuickInfoCard

v 0.1.66

- now when i click in an empty daycard i get to create Event and the eventDateandTime gets read right away via params

v 0.1.65

- modified EventCardProps type and adaption in CalendarContainer and EventsContainer

v 0.1.64

- HomePage now also displays a CalendaToggleBtn

v 0.1.63

- CalendarCard is now using a custom Modal "ModalCarousel" to display events when clicking in days in Calendar

v 0.1.62

- corrected Hover effects for all daycards in all views.
- implemented a fetch all events incusing likes server function and called in likes and follow route

v 0.1.61

- correct Hover effects for all daycards in all views.
- modified daycard dimensions for in day view

v 0.1.60

- new loadingCards for EventCards in EventsList
- DayCard now only with <img> and not Image component anymore
- now multiple genres are possible to choose when creating an event
  - updated prisma schema and zod schema (instead of genre -> genres)
- also you can filter for multiple genres in calendar (genresDropdown)
- new hover effect for EventCard and DayCard (in DayCard only for month an week view)
- fetchEvents and fetchlikes now also includes location and genres
- if you yare not signed in and no cookie is set for userLocation you get prompted to do so and the genresdropdown checks if you are signedin or not.
  - if you are not signed and a userLocation has already been set then you get prompted to select a genre

v 0.1.59

- shadcn sheet installed
- when loading homepage without being logged in i get edgestore server 404 in console log
- implemented in home page the calendar view (calendar container, etc.)
  - implemented loading Calendarcards
- EventCard mofified to work with client component.
  - no review anymore
- in mobile view the genre select opens now in sheet
- dollar sign in Event Details Page is now a Euro icon
- Navabr resposiveness adapted
- ServerFunction FetchEvents now also selects eventDateAndTime
- LikeToggleButton modified as client component
  - new function to fetch all liked ids: fetchLikeIds
  - in HeaderSection we now need to fetch the Ids to pass them down to the LikeToggleButton
  - every compoennt that uses now LikeToggleButton needs to pass the like ids as prop to avoid fetch each single event as a POST request
- CalendarEventType replaced with EventCardProps in all instances

v 0.1.58

- when creating an Event successfully EventSuccessDialog gets displayed
- therefore adapted the server Action
- added the possibilty to add an icon to HeaderSection
  - added several icons to the different menus
- in createEvent replaced the title with the HeaderSection
  - also added icons for the different sections in the form
- added icons for paypal, metamask and bitcoin to public folder

v 0.1.57

- renamed cityFilterIndicator to locationIndicator
- set responsiveness in guestLocationIndicator and LocationIndicator.
  - hover now from xl on and click until xl. no shadcn components anymore.
- GenresDropdown responsivenes of clicking or hovering is now limited at xl instead of md
- text-primary for icon in genresDropdown

v 0.1.56

- added GenresDropdown to Navbar and removed the previous genre selector from the HomePage component.
- removed the params sets in guestLocationContainer as its all handled by the cookies
- modified the loading in profie route

v 0.1.55

- laoding skeleton for create Events!
- installed next-client-cookies to store location for guest users
  - CookieProvider in layout.tsx
- a dialog prompt appears on load of homepage asking for location selection
  - use of GuestLocationContainer in a Dialog including the same country, state and city selectors as in profile settings
    - the guestLocation gets stored in a guestLocation Cookie and read in HomePage Component
  - depening on if there is a user in navbar we display LocationIndicator or GuestLocationIndicator
  - country, state and city selectors now have : autoComplete="off"
  - adapted fetchEvents server funtcion in order to deal with the !user case

v 0.1.54

- Added userCountry, userState and userCity to Profile Model in Schema and Prisma
- Library world-countries replaced with library country-state-city, therefore i created a new countryInput Field called CountrySelect. All helper function are updated to the new package.
  - its used now in AddressInputContainer instead of CountriesInput.
- In ProfileSettings I added new InputFields: Country, State, City.
  - userCountry uses headlessUI Component.
- new loading Skeleton for Profile route.
- Updated Server Functions implementing userCountry and userState

v 0.1.53

- added userCity and userCountry to prisma Profile model and Schemas
  - db is updated and i set manually Berlin and Germany
- fetchEvents now checks if there is a user and if there is it fetches only the events where there is a match from event city and userCity
- in profile route the tabs can now get accessed with search params

v 0.1.52

- Eventslug component refactured to minimize redudant code

v 0.1.51

- reusable SelectionDialog implemented in PriceInput, GenreSelect and TimePicker (using shadcn Dialog). no more SelectModal...
- for createEvent set a -mx-2 for mobile view
- DateAndTimePicker now gets displayed in a row in mobile view due to space problems

v 0.1.50

- added organizer to CreateEvent
  - when there is no organizer related to the profile alert with prompt for action accurs

v 0.1.49

- added property unoptimized to all nextjs Image components
- installed sharp for image optimizazion before storing in edgestore.
  - flag avatar and flyer

v 0.1.48

- implemented the new Schema with Organizer in prisma
- refactured all Profile Settings including email and password to be able to use Oranizer
- multiple organizer can now be set for one profile
- in FormContainer added the prop success and a redirection in case of success with useEffect
- refactured create Profile to use with Organizer.

v 0.1.47

NEW BRANCH: Organizer

- Organizer tab with all its components created
  - When there is no organizer yet you can add a new one with form lodad in a Dialog
  - then a list of OrganizerProfile is mapped with crud functions.
- ProfileImageUplaod got refacured and split into two pars
  - first is the baseImageUpload and ProfileImageUpload is the specific code
  - OrganizerImageUpload got created as second component using the baseImageUpload
- ServerActions for organizer have names but no logic yet.

v 0.1.46

- in updateProfileAction firstName, lastName and userName and now first send to clerk and then updated in the db fetching from clerk (source of truth)
- last modification before implementing ORGANIZER model
- added a try catch block in UserIcon as it broke the app when user was not logged in!

v 0.1.45

- followed organizers events only display upcoming events

v 0.1.44

- ProfileUmageUpload now also stores the clerk url in the db.

v 0.1.43

- profile in db is now synced to clerk. clerk is the source of truth username, first name, last name & email
  - image is now being stored in clerk and fetched from clerk.
- added to profile page:
- new profileImageUpload
- add new email
- change password
- new shadcn components installed:
  - radio-group
  - alert
  - alert-dialog
  - tabs

v 0.1.42

- new server function to check amdin: checkUserRole
- implemented in menu bar to display admin route

v 0.1.41

- MyEvents now displays : date, location, price and likes
- likes are now fetched and not hardcoded
- host is now called organizer
- in organizerCard now the name that gets displayed is the username not the FirstName
- HeaderSection contains now BreadCrumbs
- Profile now has description option for in FormInputs
- new route: FollowedOrganizerEventsPage

v 0.1.40

- implemented a calendar in liked events and creators feed
  - you can open the fyler in a model by clicking on the evnet dates in the calendar

v 0.1.39

- favorites is now called likes
  - route renamed
  - menu renamed
  - all server actions also renamed
- new route for followed creators events
- new HeaderSection in liked events and followd creators events

v 0.1.38

- refactured event slug and implemented it in responsivity.
  - created components: EventDetailsCard, HostCard, LikesCard, QuickInfoCard, VenueFeaturesCard
- refactured the admin and owner checks in event slug with server actions
- a owner can not see the follow button anymore

v 0.1.37

- refacture prisma schema model relations in order to make profileId the main reference in the db.
  - refacture all necessary server actions to achieve that goal as well (except the ones that were not in use yet)
  - refacture followToggleButton and FollowToggleForm
- toast now displays only 4000ms

v 0.1.36

- follow user functionality implemented.
  - whats missing: user shall not be able to follow himself
  -

v 0.1.35

- some margin adaption on mobile view for title and subitle in event slug
- in event slug the favourite heart now is text-primary

v 0.1.34

- shadcn dialogue (modal) installed
- copy to clipboard and facebook in share button on event slug added

v 0.1.33

- slogan integrated in profile
  - attention: modified updateProfile action

v 0.1.32

- New UI for event slug
  - therefore adaptions as well in EventMap.tsx (mt)
  - also in ImageContainer (mt)
  - LocationDetails

v 0.1.31

- in createEvent the googleMapsLink is now also available for user Input (no ReadOnly anymore)
  - useGoogleAutocomplete adapted for that
- in schema country, bars and outdoorAreas is now not optional anymore as it starts with 0
- event details are only shown in event slug if value is bigger than 0
- eventDetails renamed to LocationDetails
- Maps recieves now the props of country, city, street and postalCode and displays the ubication
- description in event slug now renders conditionally if there is a description
- EventDetails is now called LocationDetails
- fetchEventDetails is now called fetchLocationDetails
- fetchMyEventDetails is now called fetchMyLocationDetails

v 0.1.30

- middleware: removed the public route for edgeStore
- CountryAndFlagName adapted and therefore also its component render in  
  EventCard, EventMap and bookings page.tsx
- addressInputContainer receives now defaultValues
  - also added in editMyEvent
- schemas: description, bars, floors, outdoorAreas are now optional
- also adapted in prisma schema
- CountryInput now recieves defaultValue
- toast in FormContainer now with bg-primary
- frontend validation for TextAreaInput in creaetEvent
  - now max words 100!

v 0.1.29

- dev --turbo activated for run dev
- AddressInputContainer implemented in createEvent
  - inside there are FormInputs for location, country, city, street, postal code, google maps link
  - Google Maps Auto Complete implementated for these forms
  - couuntry has an own Component called CountryInput.
  - it also displays flags with library
  - google maps input is read only.
- schema and Event prisma module updated with : location, city, street, postalCode, country, googleMapsLink

v 0.1.28

- new supabase db connected in .env
- in event slug now also the isUser can see the deleteEvent.
- updated prisma

v 0.1.27

- Profile Image update is now also using ImageInput with responsive dimensions. No extra uploadImage button. UpdateProfileImageAction is therefore deleted.
- InputFields for location set but commented out in createEvent

v 0.1.26

- Styles are now displayed with badge component from shadCn in events slug
- Genre has now a melody note icon

v 0.1.26

- GenresInput and StylesInput work now without a container --> GenresAndStylesContainer is deleted. They work with a new instance of Zustand coming from store.ts.
  - redesigned the grid for stylesInput

v 0.1.24

- edge store is now fully implemented only in the backend and integrated in the server actions (upload and delete). images are getting deleted from edge store server when deleting an event. and when update an event, the current image gets first deleted and then the new image uploaded. no frontend implementation like in the versions 0.1.22 und 0.1.23.
- made an npm audit fix

v 0.1.23

- i can now edit the image with the singleImageDropbox using Edgestore method

v 0.1.22

- implemented edgeStore image upload in create Event instead of using supabase storage including temp file logic

v 0.1.21

- in eventDateAndTimeContainer when i create an event and dont select the ending then i send null to db. when i select the checkbox in create or editEvent with null i display as default the selected date and time from the beginning. when i already have endDateandTime and deselect it in the edit it stores again null in db
- animation for appeariance of EventDateAndTime

v 0.1.20

- EventEndDateTimePicker implemented, also in db
- subtitles in NameAndSubtitle can now be edited
- when the checkbox add-subtitle is unchecked it sends empty string to db

v 0.1.19

- tailwind screen debug installed
- prettier for tailwind classes installed
- mb for FormInput name adpated

v 0.1.18

- FormCheckbox created as reusable Checkbox
- NameAndSubtitleContainer created which contains FormInput for name and a checknox that displays formInput for subtitles
- selected price in the Choose Price button is now with text-primary

v 0.1.17

- Choose Price Button added next to PriceInput

v 0.1.16

- tagline is now called subtitle
- adaption of Event slug ui to new subtitle

v 0.1.15

- GenreAndStylesInout is now called GenreAndStylesContainer
- the GenreAndStylesInout is now using excluded useGenreStyle function to make the component cleaner
  ^
  v 0.1.14

- selectModal is now a reusable component
- TimePicker is using the selectModal
- GenrePicker is now also using the selectModal instead of shadCn select ui

v 0.1.13

- TimePicker: dates in the past are now disabled.
- in schema: eventDateAndTime must be at least 1h in the future

v 0.1.12

- TimePicker now working in editMyEventPage
- renaming of variables for dateAndTimePickerContainer
- calendar now closes

v 0.1.11

- eventDate is now called eventDateAndTime in db and app

v 0.1.10

- TimePicker implemented and added to DateAndTimePickerContainer
- result gets added to eventDate and gets saved together with the DatePicker value in the db
- therefore createEventAction got updated

v 0.1.9

- DatePicker now in editMyEvents
- Genres and corresponding Styles with booleans are fetched correctly in editMyEvents

v 0.1.8

- DatePicker implemented in CreateEvent.
  - adaption in:
    - createEvent
    - createEventAction (actions)
    - EventDetailsPage
    - schemas & prisma schemas

v 0.1.7

- property details are now location details with its corresponding sections

v 0.1.6

- all styles created

v 0.1.5

- motion-framer installed
- depending on wich genre i chose the styles will display correspondingly (getStyles.ts)
-

v 0.1.4

- some changes of default values for create Event

v 0.1.3

- all names of rental or rentals are replaced with my-event or my-events

v 0.1.2

- all names of Property or properties replaced with Event or events

v 0.1.1

- styles are now called as actual styles
- categories are now called genres

v 0.1.0

- connected to db with prisma and hosted at supabase. Project name: my-latin-event
- clerk auth project called : my-latin-event
  - admin is github account
- Amenities is now called Styles
