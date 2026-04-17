# 🏗️ Architecture & Design Document

## Project Overview

Multi-Source Intelligence Fusion Dashboard is a full-stack web application that aggregates data from multiple intelligence sources (OSINT, HUMINT, IMINT) into a unified visualization layer.

## System Architecture

### High-Level Flow
```
User Upload (File)
    ↓
Frontend Upload Component
    ↓
Multer (File Storage)
    ↓
Parser (CSV/JSON/Excel/Image)
    ↓
Unified GeoPoint Schema
    ↓
MongoDB Storage
    ↓ 
Express API
    ↓
React Components
    ↓
Leaflet Map Visualization
```

## Core Concept: Unified GeoPoint Schema

This is the **KEY INNOVATION** of the project.

### Problem
Data from different sources has different structures:
- CSV: title, description, lat, lng, ...
- JSON: { type, title, lat, lng, ... }
- Excel: Column headers vary
- Images: Binary data with metadata

### Solution
Convert all sources to a single schema:

```typescript
interface GeoPoint {
  id: string;              // Unique identifier
  type: "OSINT" | "HUMINT" | "IMINT";  // Intelligence type
  lat: number;             // Latitude
  lng: number;             // Longitude
  title: string;           // Location/Event name
  description: string;     // Detailed info
  image: string | null;    // URL or null
  source: string;          // Origin (csv/json/excel/image)
  uploadedAt: Date;        // Upload timestamp
  metadata: object;        // Original data preserved
}
```

### Benefits
1. **Consistent**: Same structure regardless of source
2. **Queryable**: Can filter by type, location, date
3. **Visualizable**: Perfect for map markers
4. **Extensible**: Easy to add new fields
5. **Filterable**: Switch between intelligence types

## Component Architecture

### Frontend Components

#### Map Component
- **Responsibility**: Display GeoPoints on Leaflet map
- **Props**: data: GeoPoint[]
- **Features**:
  - Autonomously calculates map center from data
  - Color-coded markers by type
  - Hover tooltips with details
  - Click popups with full information
  - Image preview in popups
  
#### Upload Component
- **Responsibility**: Accept file input and send to backend
- **Props**: onUploadSuccess callback
- **Features**:
  - Accepts CSV, JSON, Excel, Images
  - Shows upload progress
  - Error handling with messages
  - Triggers map refresh on success

#### Filter Component
- **Responsibility**: Toggle intelligence types
- **Props**: filters object, onFilterChange callback
- **Features**:
  - Checkbox controls
  - Color visual indicators
  - Real-time map updates
  - Statistics display

#### App Component (Main)
- **Responsibility**: State management and orchestration
- **State**:
  - data: All fetched GeoPoints
  - filteredData: Currently displayed points
  - filters: Active intelligence type filters
  - loading: Data fetch state
- **Logic**:
  - Fetches data on mount
  - Applies filters to data
  - Passes callbacks to child components
  - Handles upload success refresh

### Backend API

#### `POST /api/upload`
- **Parser Pipeline**:
  ```
  File → Multer → Format Detection → Parser → GeoPoint[] → MongoDB
  ```
- **Parsers**:
  - CSV: PapaParse + mapping
  - JSON: Native JSON.parse + validation
  - Excel: SheetJS + sheet_to_json
  - Image: Multer storage + metadata

#### `GET /api/data`
- **Query Parameters**:
  - type: Filter by intelligence type
  - limit: Max results (default 1000)
- **Response**: Array of GeoPoints

#### `DELETE /api/data/:id`
- Remove single GeoPoint by ID

### Database Schema

MongoDB Collection: `intelligence_data`

```javascript
{
  _id: ObjectId,
  id: String (unique),
  type: String (enum),
  lat: Number,
  lng: Number,
  title: String,
  description: String,
  image: String or null,
  source: String,
  uploadedAt: Date,
  metadata: Mixed,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}

Indexes:
- id (unique)
- type (for filtering)
- lat, lng (for geo queries)
- uploadedAt (for sorting)
```

## Data Flow Diagrams

### Upload Flow
```
User selects file
    ↓
Upload.js: File → FormData
    ↓
API POST /api/upload (multipart/form-data)
    ↓
upload.js route:
    ├─ Multer saves file to disk
    ├─ Detect file type
    ├─ Parse → GeoPoint[]
    └─ MongoModel.insertMany()
    ↓
Response: { success, message, data }
    ↓
App.js: onUploadSuccess()
    ├─ fetchData()
    ├─ setData()
    └─ applyFilters()
    ↓
Map Component re-renders with new markers
```

### Filter Flow
```
User clicks checkbox
    ↓
Filter.js: handleToggle()
    ↓
onFilterChange(newFilters)
    ↓
App.js: handleFilterChange()
    ├─ setFilters(newFilters)
    ├─ applyFilters(data, newFilters)
    └─ setFilteredData()
    ↓
Map Component re-renders with filtered markers
```

### Display Flow
```
App mounted
    ↓
useEffect → fetchData()
    ↓
GET /api/data
    ↓
Response: GeoPoint[]
    ↓
setData() + setFilteredData()
    ↓
Map Component renders:
    ├─ MapContainer center={calculated}
    ├─ TileLayer (OSM)
    └─ CircleMarker[] for each point
        ├─ Color by type
        ├─ Tooltip on hover
        └─ Popup on click
```

## File Upload Processing

### CSV Processing
```javascript
parseCSV(filePath) {
  1. Read file stream
  2. PapaParse with header option
  3. Map rows:
     {
       id: `csv-${timestamp}-${index}`,
       type: 'HUMINT',
       lat: parseFloat(row.lat),
       lng: parseFloat(row.lng),
       title: row.title,
       description: row.description,
       image: null,
       source: 'csv',
       metadata: row
     }
  4. Return GeoPoint[]
}
```

### JSON Processing
```javascript
parseJSON(filePath) {
  1. Read file
  2. JSON.parse()
  3. Ensure array
  4. Map items:
     {
       id: `json-${timestamp}-${index}`,
       type: item.type || 'OSINT',
       lat: parseFloat(item.lat),
       lng: parseFloat(item.lng),
       ...
     }
  5. Return GeoPoint[]
}
```

### Image Processing
```javascript
processImage(filePath, filename) {
  1. Multer already saved to /uploads
  2. Create GeoPoint:
     {
       id: `image-${timestamp}`,
       type: 'IMINT',
       lat: 0,
       lng: 0,
       title: filename,
       description: 'Satellite or aerial imagery',
       image: `/uploads/${filename}`,
       source: 'image'
     }
  3. Return [GeoPoint]
}
```

## Color Scheme

| Type | Color | Hex | Use Case |
|------|-------|-----|----------|
| OSINT | Blue | #3b82f6 | Open Source Intelligence |
| HUMINT | Yellow | #fbbf24 | Human Source Intelligence |
| IMINT | Red | #ef4444 | Imagery Intelligence |

## Error Handling

### Frontend
- File upload errors: Display in error message div
- Network errors: Console log + UI message
- Empty data: Show "No data" message
- Invalid files: Rejected by file input accept

### Backend
- Missing file: 400 "No file uploaded"
- Invalid format: 400 "Unsupported file type"
- Parse errors: 500 with error message
- DB errors: 500 with error details
- CORS: Handled by cors middleware

## Security Considerations

### Current (Simple Assignment)
- Local file storage only
- No authentication
- No file size limits (add in production)
- No input validation (add in production)

### Optional Production
- JWT authentication
- File size limits (multipart sizes)
- Input validation & sanitization
- AWS S3 for file storage
- Rate limiting
- HTTPS only
- CORS whitelist

## Performance Considerations

### Optimization Opportunities
1. **Map Rendering**: Consider marker clustering for 1000+ points
2. **Data Loading**: Pagination instead of loading all data
3. **Image Compression**: Store thumbnails, lazy load full images
4. **Caching**: Browser cache for static assets
5. **Database Indexes**: On type, lat/lng for geo queries
6. **Lazy Loading**: Load map tiles as needed

### Current Limitations
- All data loaded at once (limit 1000)
- No pagination
- No marker clustering
- All images at full resolution
- No caching layer

## Testing Strategy

### Unit Tests (Optional)
- Parser functions (CSV, JSON, Excel)
- API route handlers
- Component logic

### Integration Tests (Optional)
- Full upload → display flow
- Filter functionality
- Data retrieval

### Manual Testing (Current)
1. Upload CSV → verify markers appear
2. Hover markers → check tooltip
3. Click markers → check popup
4. Toggle filters → verify markers shown/hidden
5. Upload JSON → verify OSINT type
6. Upload image → verify IMINT marker

## Future Enhancements

### Phase 2
- [ ] Search functionality
- [ ] Sidebar list view with sorting
- [ ] Export filtered data (CSV/JSON)
- [ ] Map clustering for dense areas

### Phase 3
- [ ] User authentication (JWT)
- [ ] User-specific data
- [ ] Collaborative sharing
- [ ] Data versioning/history

### Phase 4
- [ ] AWS S3 integration
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline
- [ ] Advanced ML analysis

## Deployment

### Development
- Backend: `npm run dev` (port 5000)
- Frontend: `npm start` (port 3000)
- Database: Local MongoDB or Atlas

### Production
- Backend: Node.js server (Heroku/AWS/Azure)
- Frontend: React static build (Vercel/Netlify)
- Database: MongoDB Atlas
- Storage: AWS S3 (optional)
- CDN: CloudFront (optional)

---

This architecture is designed to be:
- **Simple**: Minimal dependencies, clear flow
- **Scalable**: Can add features without major changes
- **Maintainable**: Well-organized code, clear patterns
- **Extensible**: Easy to add new parsers or features
