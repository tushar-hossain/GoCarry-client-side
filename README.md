# GoCarry --- Client Side

GoCarry is a modern parcel delivery web application built with **React +
Vite**. It provides a complete customer-facing delivery experience
including authentication, parcel booking, delivery-cost calculation,
online payments, parcel management, tracking, notifications, and
responsive dashboards.

## 🚀 Live Project

- **Live Website:** Add your live URL here

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Parcel Management](#parcel-management)
- [Delivery Pricing](#delivery-pricing)
- [Payment System](#payment-system)
- [Rider Workflow](#rider-workflow)
- [Admin Workflow](#admin-workflow)
- [Coverage Map](#coverage-map)
- [Pricing Calculator](#pricing-calculator)
- [Routing](#routing)
- [API Architecture](#api-architecture)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Development Commands](#development-commands)
- [Responsive Design](#responsive-design)
- [Error Handling](#error-handling)
- [Security](#security)
- [Testing Checklist](#testing-checklist)
- [Parcel Booking Flow](#parcel-booking-flow)
- [Rider Assignment Flow](#rider-assignment-flow)
- [Deployment](#deployment)
- [Contribution](#contribution)
- [Developer](#developer)

## Overview

GoCarry is a door-to-door parcel delivery platform.

Customers can:

- Create an account with email/password or Google.
- Upload a profile picture.
- Create and manage parcel bookings.
- Select sender and receiver districts.
- Select service centers dynamically.
- Calculate delivery costs.
- Review a booking summary.
- Pay delivery charges through Stripe.
- View payment status and tracking information.
- Edit and delete parcels.
- View notifications.
- Track delivery progress.

The application also contains rider and administrator workflows.

## Features

### Authentication

- Firebase Authentication
- Email/password registration
- Email/password login
- Google login
- Firebase user profile
- Protected routes
- Firebase access-token based API authentication
- Logout
- Registration/login loading states

### User Dashboard

- Dashboard overview
- My Parcels
- Send A Parcel
- Payments
- Notifications
- Profile management
- Parcel details
- Tracking information

### Parcel Management

A parcel contains information such as:

- Parcel type
- Parcel name
- Weight
- Sender name
- Sender phone
- Sender district
- Sender service center
- Sender address
- Pickup instruction
- Receiver name
- Receiver phone
- Receiver district
- Receiver service center
- Receiver address
- Delivery instruction
- Delivery cost
- Payment status
- Delivery status
- Tracking ID
- Creator
- Creation date

Users can create, edit, view, and delete parcels.

### Dynamic District and Service Center Selection

The sender and receiver district selectors are connected to the
available service centers.

Flow:

```text
Select district
      ↓
Find matching warehouse
      ↓
Read covered_area
      ↓
Display service centers
```

When a district changes, the selected service center is reset.

### Edit Parcel

From My Parcels:

```jsx
navigate("/dashboard/send-parcel", {
  state: {
    parcel,
  },
});
```

The Send Parcel page checks:

```jsx
const editingParcel = location.state?.parcel;
const isEditMode = Boolean(editingParcel?._id);
```

When edit mode is active, the existing parcel data is loaded into React
Hook Form using `reset()`.

The user can edit the data and submit it to:

```text
PATCH /parcels/:id
```

### Delete Parcel

Users can delete a parcel from My Parcels.

The UI should disable the delete button while the delete mutation is
pending.

## Delivery Pricing

The delivery price is calculated using:

- Parcel type
- Parcel weight
- Sender district
- Receiver district

### Document

Destination Price

---

Same district ৳60
Different district ৳80

### Non-document up to 3 KG

Destination Price

---

Same district ৳110
Different district ৳150

### Non-document above 3 KG

Base price:

- Same district: ৳110
- Different district: ৳150

Additional weight:

```text
Extra weight = Weight - 3
Extra charge = Extra weight × ৳40
Final cost = Base price + Extra charge
```

Example:

```text
Weight = 5 KG
Base price = ৳110
Extra weight = 2 KG
Extra charge = 2 × ৳40 = ৳80
Total = ৳190
```

The booking form displays a confirmation summary before creating or
updating a parcel.

## Payment System

GoCarry uses Stripe for payment processing.

Payment flow:

```text
Open payment page
      ↓
Load parcel
      ↓
Read delivery cost
      ↓
Enter card information
      ↓
Create Stripe PaymentMethod
      ↓
Create PaymentIntent through backend
      ↓
Confirm Card Payment
      ↓
Save successful payment
      ↓
Update payment status
      ↓
Display tracking ID
```

The Pay Now button uses a loading/disabled state while payment is being
processed so users cannot submit the same payment repeatedly.

### Stripe Test Cards

Common Stripe test cards used during development include:

```text
4242 4242 4242 4242
4000 0566 5566 5556
5555 5555 5555 4444
3782 822463 10005
```

Use Stripe test mode only. Do not use real card information in
development.

## Notifications

GoCarry supports delivery notifications.

Example:

```text
Admin assigns parcel to rider
          ↓
Backend updates parcel assignment
          ↓
Backend creates rider notification
          ↓
Rider sees notification
```

Possible notification events:

- Rider assignment
- Parcel pickup
- Parcel in transit
- Out for delivery
- Delivery completed
- Payment completed
- Other operational events

A notification can contain:

```text
recipient
title
message
type
parcelId
isRead
createdAt
```

## Rider Workflow

Rider information can include:

```text
uid
email
name
region
district
phone
bikeBrandModel
bikeRegistrationNumber
about
status
```

A rider can:

- Apply to become a rider.
- View assigned parcels.
- Receive assignment notifications.
- Update delivery status.
- Manage delivery tasks.

Typical rider application states:

```text
pending
approved
rejected
```

## Admin Workflow

Administrators can perform operational tasks such as:

- Manage users
- Manage riders
- Approve/reject rider applications
- Assign riders to parcels
- Update rider status
- Manage parcel delivery status
- View parcel information
- Manage notifications

When a parcel is assigned to a rider, the backend should create a
notification for the assigned rider.

## Coverage Map

GoCarry contains a Bangladesh delivery coverage map.

District data contains information such as:

```text
district
latitude
longitude
```

The coverage page can:

- Display district markers.
- Search for districts.
- Select a district.
- Pan/zoom to the selected district.
- Show delivery coverage.

The map is implemented using Leaflet/React Leaflet.

## Pricing Calculator

The public Pricing section provides a delivery-cost calculator.

Users can select:

- Parcel type
- Delivery destination
- Weight

The calculator displays the estimated delivery cost.

The calculation should remain consistent with the parcel booking pricing
rules.

## Public Pages

The client contains public-facing pages/sections such as:

```text
Home
Services
Pricing
Coverage
FAQ
Blogs
Contact
Login
Register
```

The public UI focuses on:

- Delivery service information
- Pricing
- Coverage
- Frequently asked questions
- Blog content
- Contact information
- User authentication

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- Tailwind CSS
- shadcn/ui
- React Hook Form
- TanStack Query
- Axios
- SweetAlert2
- Lucide React
- React Icons

### Authentication

- Firebase Authentication
- Firebase access tokens

### Payment

- Stripe
- `@stripe/react-stripe-js`

### Maps

- Leaflet
- React Leaflet

### Image Upload

- ImgBB

### Backend Communication

- Axios
- REST API

### Backend

The frontend communicates with a separate backend built with:

- Node.js
- Express.js
- MongoDB
- Firebase Admin
- Stripe

## Project Structure

A typical structure is:

```text
gocarry-client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── ui/
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useAxiosPublic.js
│   │   ├── useAxiosSecure.js
│   │   └── ...
│   ├── layouts/
│   │   ├── RootLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── Home/
│   │   ├── Services/
│   │   ├── Pricing/
│   │   ├── Coverage/
│   │   ├── FAQ/
│   │   ├── Blogs/
│   │   ├── Contact/
│   │   ├── Login/
│   │   ├── Register/
│   │   └── Dashboard/
│   ├── providers/
│   ├── routes/
│   ├── firebase/
│   ├── data/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.local
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

Adjust the structure to match the actual repository.

## Routing

React Router handles client-side navigation.

Typical routes:

```text
/
├── /services
├── /pricing
├── /coverage
├── /faq
├── /blogs
├── /contact
├── /login
├── /register
└── /dashboard
    ├── /dashboard/home
    ├── /dashboard/send-parcel
    ├── /dashboard/myParcel
    ├── /dashboard/payments/:id
    ├── /dashboard/notifications
    └── /dashboard/profile
```

Actual paths depend on the router configuration.

## Protected Routes

Private pages require an authenticated Firebase user.

General flow:

```text
Open protected page
       ↓
Check Firebase user
       ↓
Authenticated?
   ↙        ↘
 Yes         No
 ↓            ↓
Render       Redirect
page         to Login
```

Role-specific routes can additionally check:

```text
user
rider
admin
```

## API Architecture

The client uses two Axios patterns.

### Public Axios

Used for APIs that do not require authentication.

```jsx
const axiosPublic = useAxiosPublic();

await axiosPublic.post("/users", userInfo);
```

### Secure Axios

Used for authenticated APIs.

```jsx
const axiosSecure = useAxiosSecure();

await axiosSecure.get("/parcels");
```

The secure Axios instance attaches the Firebase access token:

```http
Authorization: Bearer <firebase-access-token>
```

### Authentication Request Flow

```text
Firebase Login
      ↓
Firebase User
      ↓
Firebase Access Token
      ↓
Secure Axios
      ↓
Authorization Header
      ↓
Express API
      ↓
Firebase Token Verification
      ↓
Protected Resource
```

## React Query

TanStack Query manages server state.

### Queries

Used for reading data:

```jsx
const { data, isPending } = useQuery({
  queryKey: ["parcels"],
  queryFn: async () => {
    const response = await axiosSecure.get("/parcels");
    return response.data;
  },
});
```

### Mutations

Used for actions such as:

- Create parcel
- Update parcel
- Delete parcel
- Update rider status
- Save payment
- Update profile
- Mark notifications as read

Example:

```jsx
const mutation = useMutation({
  mutationFn: async (data) => {
    const response = await axiosSecure.patch(
      `/parcels/${data.id}`,
      data.payload,
    );

    return response.data;
  },
});
```

After a successful mutation, invalidate the related query when the UI
needs fresh data.

## React Hook Form

React Hook Form is used for:

- Login
- Registration
- Send Parcel
- Profile
- Rider application
- Other application forms

Example:

```jsx
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm();
```

`Controller` is used for controlled components such as custom Select
components.

## Environment Variables

Create `.env.local` in the project root.

Example:

```env
VITE_API_URL=http://localhost:5000

VITE_IMGBB_API_KEY=your_imgbb_api_key

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
```

Use the exact variable names required by the source code.

Never commit environment files containing secrets:

```text
.env
.env.local
.env.*.local
```

## Installation

### 1. Clone {#1-clone}

```bash
git clone <https://github.com/tushar-hossain/GoCarry-client-side>
```

### 2. Enter the project {#2-enter-the-project}

```bash
cd gocarry-client
```

### 3. Install dependencies {#3-install-dependencies}

```bash
npm install
```

### 4. Configure environment variables {#4-configure-environment-variables}

Create `.env.local` and configure:

- Firebase
- Backend API
- ImgBB
- Stripe

### 5. Start development {#5-start-development}

```bash
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Create production build
npm run build

# Preview production build
npm run preview
```

## UI Design

GoCarry uses a clean parcel-delivery visual system.

Main colors:

```text
Dark Green: #03373D
Lime:       #CAEB66
Teal:       #067A87
Muted Text: #71717A
Border:     #D9E0E5
```

The interface uses:

- Rounded cards
- Responsive grids
- Consistent spacing
- Clear form labels
- Accessible controls
- Responsive dashboards
- Loading states
- Error states
- Confirmation dialogs

## Responsive Design

The application is designed for:

- Mobile
- Tablet
- Desktop

Tailwind responsive utilities are used throughout the project.

Example:

```jsx
<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
```

## Reusable Components

Reusable UI components help keep the application consistent.

Examples:

- Button
- Input
- Select
- Textarea
- Dialog
- Table
- Card
- Form field
- Navbar
- Footer
- Dashboard sidebar
- Notification dropdown

shadcn/ui components are used where appropriate.

## Error Handling

The client should handle:

- Firebase authentication errors
- API errors
- Network failures
- Stripe errors
- Invalid form data
- Missing parcel data
- Unauthorized requests
- Expired tokens
- Failed image uploads

User-facing error messages should be clear and should not expose
sensitive backend information.

### Firebase problems

Check:

- Firebase configuration
- Authorized domains
- Enabled authentication providers
- Email/password provider
- Google provider
- Correct Firebase project

### CORS problems

Check:

- Backend CORS configuration
- Frontend API URL
- Production frontend domain
- Backend availability

### Stripe problems

Check:

- Publishable key
- Backend secret key
- PaymentIntent endpoint
- Client secret
- Stripe test mode
- Stripe Elements configuration

## Security

Never expose server-only secrets in the React application.

Do not put these in the frontend:

```text
MongoDB credentials
Firebase Admin private key
Stripe secret key
JWT signing secret
Database passwords
Private server API keys
```

Frontend configuration should contain only client-safe values.

## Testing Checklist

### Authentication

- [ ] Register with email/password
- [ ] Login with email/password
- [ ] Google login
- [ ] Invalid email
- [ ] Invalid password
- [ ] Duplicate account
- [ ] Logout
- [ ] Loading state
- [ ] Error state

### Registration

- [ ] Name validation
- [ ] Email validation
- [ ] Password validation
- [ ] Image upload
- [ ] Registration loading state
- [ ] Registration failure
- [ ] Successful registration

### Parcel

- [ ] Document parcel
- [ ] Non-document parcel
- [ ] Weight validation
- [ ] Same-district calculation
- [ ] Outside-district calculation
- [ ] Sender service center
- [ ] Receiver service center
- [ ] Booking confirmation
- [ ] Edit parcel
- [ ] Delete parcel
- [ ] View parcel

### Payment

- [ ] Payment button loading state
- [ ] Successful Stripe test payment
- [ ] Failed payment
- [ ] Payment status update
- [ ] Tracking ID display
- [ ] Redirect after successful payment

### Notifications

- [ ] Notification appears
- [ ] Rider assignment notification
- [ ] Read/unread state
- [ ] Notification refresh
- [ ] Notification dropdown

### Responsive UI

- [ ] Mobile
- [ ] Tablet
- [ ] Desktop

## Parcel Booking Flow

```text
Login
  ↓
Send A Parcel
  ↓
Select parcel type
  ↓
Enter parcel information
  ↓
Select sender district
  ↓
Select sender service center
  ↓
Enter receiver information
  ↓
Select receiver district
  ↓
Select receiver service center
  ↓
Calculate delivery cost
  ↓
Booking summary
  ↓
Confirm booking
  ↓
Parcel created
  ↓
Payment
  ↓
Stripe PaymentIntent
  ↓
Payment confirmed
  ↓
Payment saved
  ↓
Tracking ID available
  ↓
My Parcels
```

## Rider Assignment Flow

```text
Admin views parcels
        ↓
Admin assigns rider
        ↓
Backend updates parcel
        ↓
Backend creates notification
        ↓
Rider receives notification
        ↓
Rider views assigned parcel
        ↓
Rider updates delivery status
        ↓
Customer sees updated status
```

## Data Model Overview

### User

```text
uid
name
email
role
profile picture
createdAt
lastLogin
```

### Parcel

```text
_id
trackingId
parcelType
parcelName
parcelWeight
senderName
senderPhone
senderDistrict
senderServiceCenter
senderAddress
pickupInstruction
receiverName
receiverPhone
receiverDistrict
receiverServiceCenter
receiverAddress
deliveryInstruction
deliveryCost
paymentStatus
delivery_Status
created_by
creation_date
```

### Payment

```text
paymentIntentId
parcelId
amount
currency
created_by
paymentStatus
payment_date
trackingId
```

### Rider

```text
uid
email
name
region
district
phone
bikeBrandModel
bikeRegistrationNumber
about
status
```

## Deployment

The Vite application can be deployed to platforms such as:

- Netlify
- Vercel
- Firebase Hosting
- Cloudflare Pages
- Other static hosting services

Build the application:

```bash
npm run build
```

Configure production environment variables in the hosting platform.

Make sure:

```text
Frontend → Production Backend API
```

and that the backend allows the production frontend origin through CORS.

## Backend Repository

The GoCarry frontend communicates with a separate server-side
application.

Recommended structure:

```text
GoCarry
├── gocarry-client
│   └── React + Vite
│
└── gocarry-server
    └── Node + Express + MongoDB
```

The backend is responsible for:

- Database operations
- Firebase token verification
- Authorization
- Parcel APIs
- Rider APIs
- Admin APIs
- Payment APIs
- Notification creation
- Tracking
- User management

## Contribution

1.  Fork the repository.
2.  Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3.  Make your changes.
4.  Test the application.
5.  Commit:

```bash
git add .
git commit -m "feat: add your feature"
```

6.  Push:

```bash
git push origin feature/your-feature
```

7.  Open a Pull Request.

## Commit Convention

Recommended commit prefixes:

```text
feat: add parcel tracking
fix: resolve service center selection
refactor: improve payment flow
style: update dashboard UI
docs: update README
chore: update dependencies
```

## Developer

**Md. Tushar Hossain**

MERN Stack Developer / Junior Software Developer

Dhaka, Bangladesh

GoCarry demonstrates practical experience with:

- React
- Vite
- JavaScript
- Firebase Authentication
- REST APIs
- Axios
- TanStack Query
- React Hook Form
- Stripe
- MongoDB-backed applications
- Dynamic pricing
- Leaflet maps
- Rider management
- Admin workflows
- Notifications
- Parcel tracking
- CRUD operations
- Responsive UI

---

**GoCarry --- Delivering parcels with a simple, modern, and reliable
experience.**
