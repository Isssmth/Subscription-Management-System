Subscriptions Module – API Documentation

1. Overview

The Subscriptions module is part of the Brightloop Subscription Management System.

It manages:

- Quotation creation and confirmation.
- Subscription creation.
- Subscription status management.
- Customer subscription records.
- Subscription product and variant details.

Base URL: "http://localhost:8080/api"

2. Quotation APIs

2.1 Create Quotation

- Method: POST
- Endpoint: "/quotations"

Request Body:

{
  "customerId": 1,
  "planId": 1,
  "validityDate": "2026-11-10",
  "lines": [
    {
      "productId": 1,
      "variantId": 1,
      "priceId": 1,
      "quantity": 2,
      "unitPrice": 499.00
    }
  ]
}

Creates a quotation with customer, plan and product details.

2.2 Get All Quotations

- Method: GET
- Endpoint: "/quotations"

Returns all quotations.

2.3 Get Quotation by ID

- Method: GET
- Endpoint: "/quotations/{id}"

Returns the quotation matching the given ID.

2.4 Confirm Quotation

- Method: PUT
- Endpoint: "/quotations/{id}/confirm"

Request Body:

{
  "startDate": "2026-11-01",
  "billingInterval": "MONTHLY",
  "autoRenew": true
}

Confirms a pending quotation and creates a subscription with the quotation's product lines.

3. Subscription APIs

Method| Endpoint| Description
GET| "/subscriptions"| Get all subscriptions
GET| "/subscriptions/{id}"| Get subscription by ID
GET| "/subscriptions/customer/{customerId}"| Get subscriptions by customer
GET| "/subscriptions/{id}/lines"| Get subscription product lines
PUT| "/subscriptions/{id}/activate"| Activate a confirmed subscription
PUT| "/subscriptions/{id}/pause"| Pause an active subscription
PUT| "/subscriptions/{id}/resume"| Resume a paused subscription
PUT| "/subscriptions/{id}/close"| Close a subscription

4. Subscription Status

The module uses the following statuses:

- CONFIRMED: Subscription created after quotation confirmation.
- ACTIVE: Subscription activated.
- PAUSED: Subscription temporarily paused.
- CLOSED: Subscription closed.

Status Flow

CONFIRMED
    |
    v
  ACTIVE
    |
    v
  PAUSED
    |
    v
  ACTIVE
    |
    v
  CLOSED

A confirmed subscription can also be closed directly.

5. Billing Intervals

The module supports:

- DAILY
- WEEKLY
- MONTHLY
- YEARLY

6. Quotation Line and Subscription Line Details

Each line stores:

Field| Description
productId| Product identifier
variantId| Product variant identifier
priceId| Price identifier
quantity| Number of units
unitPrice| Price per unit
amount| Quantity × unit price

Product variant and price identifiers are retained when a quotation is converted into a subscription.

7. Validation and Error Handling

The module validates:

- Required customer, plan and product identifiers.
- Positive quantity.
- Valid quotation date.
- Valid subscription start date.
- Required billing interval.
- Allowed subscription status transitions.

Invalid requests return HTTP 400 with an error message.

8. Implementation Notes

- Spring Boot REST controllers expose the APIs.
- Spring Data JPA repositories manage database operations.
- Hibernate/JPA entities represent quotations and subscriptions.
- DTOs validate incoming requests.
- A centralized exception handler manages validation and business errors.

Current prototype limitations:

- Unit price is temporarily accepted from the quotation request. It should later be retrieved and verified through the Catalog module using "priceId".
- The initial "nextBillingDate" is set to the subscription start date. Billing integration should manage subsequent billing dates based on successful payments.
- Billing and payment processing are handled separately from this module.