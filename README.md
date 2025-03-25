# Prenotazione Aule

Prenotazione Aule is a web application that facilitates the booking of classrooms (aule) using the FullCalendar library. It provides an intuitive interface for users to view, create, and manage classroom reservations.

## Features

- **Interactive Calendar**
  - Visualize bookings in a user-friendly calendar format
  - Real-time synchronization across multiple users
  - Drag and drop functionality for easy modifications
  
- **Classroom Management**
  - Support for multiple classrooms simultaneously
  - Easy-to-use booking interface
  - Conflict prevention system

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ettoref70/tmp_Cal.git
   cd tmp_Cal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node backend/server.js
   ```

## Usage

### Basic Operations

| Operation | Instructions |
|-----------|-------------|
| View Bookings | Open the application to see current classroom reservations |
| Create Booking | Click and drag on desired time slot → Enter details → Save |
| Modify Booking | Drag existing booking to new time slot |
| Delete Booking | Click on existing booking → Confirm deletion |

## Contributing

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m 'Add: brief description of changes'
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request

## Technologies

- [FullCalendar](https://fullcalendar.io/) - Calendar interface
- [Sequelize](https://sequelize.org/) - ORM support

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
