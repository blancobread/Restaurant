Restaurant Reservation System Documentation
1. Introduction
This system is a restaurant reservation platform that supports both guest and registered users. It allows users to search and reserve tables, handles high-traffic scenarios through a holding fee mechanism, and manages no-show penalties via an admin dashboard. The system ensures efficient table allocation, including support for combining tables when necessary.

2. System Overview
The application provides the following core functionalities:
•	Table reservation without mandatory login (guest users) 
•	Optional registration for enhanced features 
•	Table capacity management with combination logic 
•	High-traffic day detection (weekends and special days) 
•	Holding fee authorization using simulated credit card input 
•	Admin dashboard for managing reservations and no-show penalties 

3. Functional Requirements Implementation
3.1 User Types
The system supports two types of users:
•	Guest Users 
o	Can search and reserve tables without logging in 
o	Provide name, email, and phone number 
o	Can optionally register before or after reservation 
•	Registered Users 
o	Can log in and manage reservations 
o	Reservation is linked using user_id 
o	Additional fields: 
	Name 
	Mailing address 
	Billing address 
	Preferred Diner Number 
	Earned points 
	Preferred payment method 

3.2 Table Management
•	Tables have fixed capacities: 2, 4, 6, or 8 
•	If a single table cannot accommodate the group: 
o	The system combines tables (e.g., 2 + 6, 4 + 4) 
•	When tables are combined: 
tables_need_combining = true
•	The admin dashboard displays alerts for required table combinations 

4. Reservation Flow
4.1 Normal Reservation Flow
For non–high-traffic days:
1.	User searches for available tables 
2.	User selects a table 
3.	User enters reservation details 
4.	Reservation is created and confirmed immediately 
Database state:
requires_holding_fee = false
holding_fee_amount = 0
holding_fee_paid = false
status = CONFIRMED

4.2 High-Traffic Reservation Flow
For weekends or configured special days:
1.	User searches for tables 
2.	System detects high-traffic date 
3.	Reservation is created with pending status 
4.	User is redirected to holding fee authorization page 
Database state:
requires_holding_fee = true
holding_fee_amount = 10
holding_fee_paid = false
status = PENDING

5. Holding Fee Authorization
Users must authorize a holding fee before confirmation.
5.1 Input Fields
•	Card Number 
•	Card Type (VISA, MASTERCARD, AMEX) 
•	Expiry Date (MM/YY) 
5.2 Validation Rules
•	Card number must be 12–19 digits 
•	Card type must match predefined values 
•	Expiry must follow MM/YY format and not be expired 
5.3 Authorization Outcome
Upon successful validation:
holding_fee_paid = true
status = CONFIRMED

5.4 Payment Data Handling
For security, the system stores only:
card_last_four
card_type
card_token (simulated)
The system does not store:
•	Full card number 
•	CVV 
•	Real payment tokens 

6. Guest vs Registered User Flow
Guest Users
•	Can complete reservation without login 
•	Can authorize holding fee 
•	Payment data is not permanently stored 
Registered Users
•	Reservation linked via user_id 
•	Card details (limited) stored in payment_methods 
•	Earn points based on spending 

7. Admin Dashboard Functionality
The admin dashboard provides:
•	View of all reservations 
•	Alerts for combined tables 
•	Reservation status tracking 
•	Actions: 
o	Mark reservation as completed 
o	Mark reservation as no-show 

8. No-Show Handling
Only confirmed reservations can be marked as no-show.
Process
1.	Admin selects "Mark No Show" 
2.	System updates reservation: 
status = NO_SHOW
3.	System creates a record in no_show_charges 
Database Entry
reservation_id
user_id
charge_amount = 10.00
charge_status = pending
charged_at
This records the penalty for the no-show.

9. Complete High-Traffic Flow Summary
User selects weekend/special day
→ Reservation created (PENDING)
→ Holding fee required
→ User enters card details
→ System validates and authorizes
→ Reservation becomes CONFIRMED
→ If no-show occurs:
   → Admin marks no-show
   → System records $10 charge

10. Assumptions and Limitations
•	Payment processing is simulated (no real payment gateway integration) 
•	Only partial card data is stored for security 
•	No automatic detection of no-shows; admin intervention is required 
•	Holding fee is a fixed amount ($10) for all high-traffic reservations 
•	Duplicate no-show prevention may require additional validation logic 

11. Conclusion
The system successfully implements a complete reservation workflow with support for high-traffic handling, simulated payment authorization, and administrative control over no-show penalties. The design ensures flexibility for both guest and registered users while maintaining data integrity and usability.


