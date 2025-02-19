# Calculator Memorial Form Data Integration Plan

## Overview
We need to integrate the memorial form data from the user's cookie into the calculator component, pre-populating relevant fields and storing additional data for the payment portion.

## Data Available from Memorial Form
```json
{
  "director": {
    "firstName": "Joseph",
    "lastName": "Brown"
  },
  "familyMember": {
    "firstName": "David",
    "lastName": "Lopez",
    "dob": "1976-03-06"
  },
  "deceased": {
    "firstName": "Joseph",
    "lastName": "White",
    "dob": "1934-12-20",
    "dop": "2025-02-19"
  },
  "contact": {
    "email": "david.f24f2flopez@example.com",
    "phone": "532-951-9836"
  },
  "memorial": {
    "locationName": "Valley View Funeral Home",
    "locationAddress": "321 Valley Road, Hillcrest, NY 46011",
    "time": "19:06",
    "date": "2025-02-26"
  }
}
```

## Implementation Steps

1. **Data Structure Updates**
   - Add a new interface `MemorialFormData` to store the complete memorial form data
   - Create a hidden state variable to store this data for later use in payment processing

2. **Field Pre-population**
   - Pre-populate the following fields from memorial data:
     - Funeral Director Name: "{director.firstName} {director.lastName}"
     - Funeral Home Name: "{memorial.locationName}"
     - First Location:
       - Name: "{memorial.locationName}"
       - Address: "{memorial.locationAddress}"
     - Livestream Date: "{memorial.date}"
     - Livestream Start Time: "{memorial.time}"

3. **Additional Data Storage**
   - Store the complete memorial form data in a new state variable
   - This data will be accessible during the payment process
   - Include all contact and deceased information for reference

4. **Component Updates**
   - Add prop for memorial form data
   - Update initialization logic to populate fields when data is available
   - Modify save/checkout handlers to include memorial data in the order

5. **Type Updates**
   - Add new interfaces for memorial data structure
   - Update OrderData interface to include memorial reference data

## Technical Implementation Details

1. **New Interfaces**
```typescript
interface MemorialFormData {
  director: {
    firstName: string;
    lastName: string;
  };
  familyMember: {
    firstName: string;
    lastName: string;
    dob: string;
  };
  deceased: {
    firstName: string;
    lastName: string;
    dob: string;
    dop: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  memorial: {
    locationName: string;
    locationAddress: string;
    time: string;
    date: string;
  };
}

// Update OrderData to include memorial reference
interface OrderData {
  // ... existing fields ...
  memorialData?: MemorialFormData;
}
```

2. **Component Updates**
```typescript
// New prop
let { memorialFormData } = $props<{
  memorialFormData?: MemorialFormData;
}>();

// Initialize fields if memorial data exists
$effect(() => {
  if (memorialFormData) {
    funeralDirectorName = `${memorialFormData.director.firstName} ${memorialFormData.director.lastName}`;
    funeralHomeName = memorialFormData.memorial.locationName;
    livestreamDate = memorialFormData.memorial.date;
    livestreamStartTime = memorialFormData.memorial.time;
    locations = [{
      name: memorialFormData.memorial.locationName,
      address: memorialFormData.memorial.locationAddress,
      travelExceedsHour: false
    }];
  }
});
```

## Next Steps
1. Implement the code changes in Code mode
2. Test the pre-population of fields
3. Verify the memorial data is properly stored and accessible
4. Begin work on the payment integration

Would you like to proceed with implementing these changes in Code mode?