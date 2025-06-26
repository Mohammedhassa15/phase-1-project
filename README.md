#Phase-1-Project
## Car Rental App
A full-featured web application for managing car hire services. Users can add, edit, delete, view, hire, and unhire cars. The app includes filtering by brand and availability, form validation, and dynamic UI updates. Built using HTML, CSS, JavaScript, and a local JSON server API.

## Features
- Add a new car (with validation for price ≥ 60,000 KES)

- Edit and delete existing cars

- Hire a car (marks it as unavailable)

- Unhire a car (marks it as available again)

- Filter cars by brand and availability

- View hired cars with hirer details (name, email, location)

- Contact form with thank-you message

- Visual confirmation messages on form actions

## Project Structure
- Frontend: HTML5, CSS3, JavaScript 

- Backend (Mock API): JSON Server

- Design: Custom CSS with dark overlay background and gold/white accents
```
car-rental-app/
├── index.html
├── style.css
├── index.js
├── db.json (mock backend)
```

## How to use the App
1. Click on the Home button to see the form for adding and editing cars

2. Click on the About button to see the vehicles and their prices

3. Click on the Hire button to see the hire form and hire cars

4. Click on the Hired section to see which cars have been hired and by whom

5. You can search vehicles by either their Brand name and availability using the toggle under the About section



![Screenshot from 2025-06-25 20-56-52](https://github.com/user-attachments/assets/45e1fbe3-00f4-4fd1-82a4-b36a357e98b5)


## Example of my db.json
```
{
  "cars": [
    {
      "id": 1,
      "brand": "Toyota",
      "model": "Rav4",
      "pricePerDay": 70000,
      "imageUrl": "https://example.com/image.jpg",
      "available": true
    }
  ],
  "hires": []
}
```

## Highlights
- Elegant forms with gradient backgrounds

- Icon buttons for Edit/Delete

- Confirmation messages for all major actions

- Background image with dark overlay for a modern look


# AUTHOR:
MOHAMMED HASSAN









