# ContolloFront-end

This is the front-end application for the Contollo project. The application is built using React and other modern web technologies. Below you'll find instructions on how to set up and run the project locally.

## Prerequisites

Before you begin, ensure you have the following software installed on your machine:

- **Node.js** (v14.x or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (v6.x or higher) - npm is included with Node.js
- **Git** - [Download Git](https://git-scm.com/)

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

First, clone the repository to your local machine using Git:

git clone https://github.com/Draxton27/ContolloFront-end.git

cd ContolloFront-end

### 2. Install dependencies  

npm install

### 3. Run the Development Server  

npm run start

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


### Back-end

This is the link to the back-end repository:
https://github.com/Draxton27/ContolloBack-end

## Design Principles

### SOLID Principles

#### 1. Single Responsibility Principle (SRP)
Each React component has a single responsibility. 
The Login component handles only the login UI and logic, while the Tasks component is responsible for displaying and managing tasks.

#### 2. Open/Closed Principle (OCP)
Components are designed to be extended with new features without altering their existing code. For example, you can add new functionality to the Tasks component by using hooks.

#### 3. Liskov Substitution Principle (LSP)
React components and hooks are designed so that they can be substituted without breaking the application. 
For example, if you substitute one custom hook for another, the component behavior should remain consistent.

#### 4. Interface Segregation Principle (ISP)
Interfaces between components are kept minimal and specific. Components do not depend on methods they do not use, which could be applied by carefully designing props and state passed down to child components.

#### 5. Dependency Inversion Principle (DIP)
The frontend relies on abstractions rather than concrete implementations. For example, API calls might be abstracted away into a service, and components depend on this service rather than directly on fetch.

