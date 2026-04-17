# 📊 Testing & Verification Guide

## Pre-Flight Checklist

- [ ] Node.js v14+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MongoDB running locally (`mongod`) or Atlas connection ready
- [ ] Both `backend` and `frontend` directories have `node_modules`
- [ ] Backend server starts without errors
- [ ] Frontend builds without errors
- [ ] No port conflicts (3000, 5000)

## Backend Verification

### Health Check
```bash
curl http://localhost:5000/health
```
✅ Expected: `{"status":"Backend is running"}`

### API Verification
```bash
# Get empty data
curl http://localhost:5000/api/data
```
✅ Expected: `[]` (empty array initially)

### Multer Configuration Test
Check that `backend/uploads` folder exists and is writable:
```bash
ls -la backend/uploads/
```
✅ Should have `.gitkeep` and sample files

## Frontend Verification

### Build Check
```bash
cd frontend
npm run build
```
✅ Should complete without errors
✅ Creates `build/` folder

### Dev Server Check
```bash
cd frontend
npm start
```
✅ Should open browser to http://localhost:3000
✅ Should compile successfully

## Integration Tests

### Test 1: File Upload - CSV
1. Start both servers
2. Open http://localhost:3000
3. Click "Upload Data" in sidebar
4. Select `backend/uploads/sample_humint.csv`
5. Click Upload button
✅ Expected:
   - Success message appears
   - Map shows yellow markers (HUMINT)
   - Tooltip shows location details on hover
   - Statistics update in sidebar

### Test 2: File Upload - JSON
1. Start both servers
2. Open http://localhost:3000
3. Select `backend/uploads/sample_osint.json`
4. Click Upload button
✅ Expected:
   - Success message appears
   - Map shows blue markers (OSINT)
   - Can see both CSV and JSON markers on map

### Test 3: Filtering by Type
1. Upload both CSV and JSON files (or use provided samples)
2. Check "OSINT" checkbox to uncheck it
✅ Expected:
   - Blue markers (OSINT) disappear
   - Only yellow markers (HUMINT) visible
3. Check "OSINT" again
✅ Expected:
   - Blue markers reappear

### Test 4: Hover Popup
1. Hover over any marker on the map
✅ Expected:
   - Tooltip appears with dark background
   - Shows title, type, description
   - Shows coordinates
   - Shows image if available

### Test 5: Click Popup
1. Click on any marker
✅ Expected:
   - Popup window appears
   - Shows title, coordinates, description
   - Shows image preview if available
   - Shows source type

### Test 6: Map Pan & Zoom
1. Drag map around
2. Scroll to zoom in/out
✅ Expected:
   - Map responds smoothly
   - Markers stay properly positioned
   - Zoom controls work

### Test 7: Statistics Display
1. Upload different types of data
✅ Expected:
   - Total count updates
   - OSINT count shows correct number
   - HUMINT count shows correct number
   - IMINT count shows correct number

## Manual Data Upload Test

### Create Custom CSV
1. Create file: `test_data.csv`
   ```csv
   title,description,lat,lng,info
   Test Location 1,Important site,40.7128,-74.0060,NYC
   Test Location 2,Another site,51.5074,-0.1278,London
   ```
2. Upload via web UI
✅ Expected: Two new markers appear on map

### Create Custom JSON
1. Create file: `test_data.json`
   ```json
   [
     {
       "type": "OSINT",
       "title": "Report 1",
       "lat": 35.6762,
       "lng": 139.6503,
       "description": "Tokyo report"
     }
   ]
   ```
2. Upload via web UI
✅ Expected: New blue marker appears in Tokyo area

## Database Verification

### Check MongoDB Connection
```bash
# From backend directory
mongo  # or mongosh
use fusion_dashboard
db.intelligencedata.find().pretty()
```
✅ Should show uploaded documents with unified schema

### Verify Collection Structure
```javascript
db.intelligencedata.findOne()
```
✅ Expected document looks like:
```javascript
{
  _id: ObjectId(...),
  id: "csv-1234567890-0",
  type: "HUMINT",
  lat: 40.7128,
  lng: -74.0060,
  title: "New York HQ",
  description: "Intelligence center",
  image: null,
  source: "csv",
  uploadedAt: ISODate(...),
  metadata: {...},
  createdAt: ISODate(...),
  updatedAt: ISODate(...)
}
```

## API Endpoint Testing

### Using Postman or cURL

#### GET All Data
```bash
curl -X GET http://localhost:5000/api/data
```

#### GET Filtered by Type
```bash
curl -X GET "http://localhost:5000/api/data?type=OSINT"
```

#### Upload File
```bash
curl -X POST \
  -F "file=@/path/to/file.csv" \
  http://localhost:5000/api/upload
```

#### Delete Entry
```bash
curl -X DELETE http://localhost:5000/api/data/{objectId}
```

## Performance Testing

### Load Test: Large File
1. Create CSV with 1000 rows
2. Upload and measure:
   - Upload time
   - Processing time
   - Map render time
✅ Should complete in < 10 seconds

### Load Test: Many Markers
1. Upload multiple files to get 500+ markers
2. Check map performance:
   - Pan smoothly
   - Zoom smoothly
   - Hover response time
⚠️ Note: May need marker clustering for 1000+ points

### Memory Test
1. Monitor browser DevTools during use
✅ Memory usage should remain stable
✅ No memory leaks visible

## Common Issues & Solutions

| Issue | Check | Solution |
|-------|-------|----------|
| 404 on upload | Backend running | Start backend: `npm run dev` |
| CORS error | Proxy setting | Check frontend package.json has proxy |
| Markers not showing | Data in MongoDB | Check upload was successful |
| Map not loading | Leaflet CDN | Check internet connection |
| Page blank | React build | Any console errors? |
| File upload hangs | File size | Check Multer limits |
| Lat/lng invalid | CSV format | Ensure numeric values |

## Browser Console Checks

### Development Tools
1. Open DevTools (F12)
2. Check Console tab
✅ Should have minimal warnings
❌ Should have NO critical errors

### Network Tab
1. Monitor during file upload
✅ Should see POST to /api/upload
✅ Should see GET to /api/data
✅ Response should be JSON

### React DevTools (Optional)
1. Install React DevTools extension
✅ Should see component tree
✅ State should update correctly

## Accessibility Testing

### Keyboard Navigation
- Tab through controls
- Should be able to use upload without mouse
- Filter checkboxes should be keyboard accessible

### Color Contrast
- Markers should be visible (test with color blind mode)
- Text should have sufficient contrast

### Screen Reader
- Labels should work with screen readers
- Form inputs should be properly labeled

## Final Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can upload CSV successfully
- [ ] Can upload JSON successfully
- [ ] Markers appear on map
- [ ] Hover shows information
- [ ] Click shows full popup
- [ ] Filtering works correctly
- [ ] Statistics update
- [ ] No JavaScript errors in console
- [ ] Responsive on mobile
- [ ] Map loads completely
- [ ] All colors display correctly

## Sign-Off

Once all tests pass, the application is ready for:
- ✅ Demonstration
- ✅ Submission
- ✅ User testing
- ✅ Deployment

---

**Test Date**: ___________
**Tester**: ___________
**Status**: [ ] PASS [ ] NEEDS WORK

