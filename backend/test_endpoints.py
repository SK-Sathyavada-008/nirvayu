import urllib.request
import json
import io

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(name: str, url: str, method: str = "GET", data: bytes = None, headers: dict = None):
    req = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            res_json = json.loads(res_body)
            print(f"[PASS] [{response.status}] {name} -> Success")
            return res_json
    except Exception as e:
        print(f"[FAIL] {name} Failed: {e}")
        return None

def run_all_tests():
    print("=" * 60)
    print("Testing NIRVAYU FastAPI Backend Endpoints")
    print("=" * 60)

    # 1. Root / Health
    test_endpoint("Root / Health Endpoint", f"{BASE_URL}/")

    # 2. Hotspots
    test_endpoint("GET /api/hotspots", f"{BASE_URL}/api/hotspots?city=Hyderabad")

    # 3. Forecast with Scikit-Learn Model and Gemini Reasoning
    forecast_res = test_endpoint(
        "GET /api/forecast (ML numerical + Gemini reasoning)",
        f"{BASE_URL}/api/forecast?city=Hyderabad&current_aqi=164&traffic_density=0.85&wind_speed=5.2&temperature=31.5&heavy_vehicle_ratio=0.38"
    )
    if forecast_res and "data" in forecast_res:
        fdata = forecast_res["data"]
        print(f"   -> Numerical Source: {fdata.get('numerical_prediction_source')}")
        print(f"   -> Reasoning Source: {fdata.get('reasoning_source')}")
        print(f"   -> ML Predictions count: {len(fdata.get('predictions', []))}")

    # 4. Authority Alerts
    alerts_res = test_endpoint("GET /api/alerts", f"{BASE_URL}/api/alerts?city=Hyderabad")
    if alerts_res and "data" in alerts_res:
        alerts = alerts_res["data"]
        print(f"   -> Total Dispatches count: {len(alerts)}")

    # 5. BRICS / National Grid (Hyderabad, Banglore, Delhi, Mumbai)
    brics_res = test_endpoint("GET /api/brics (Standardized Metropolitan Grid)", f"{BASE_URL}/api/brics")
    if brics_res and "data" in brics_res:
        cities = brics_res["data"]
        print(f"   -> Standardized Cities count: {len(cities)}")
        for c in cities:
            print(f"   -> [{c.get('city')}, {c.get('country')}]: AQI={c.get('aqi')}, Risk={c.get('pollution_risk')}, Coords=({c.get('latitude')}, {c.get('longitude')}), Reports={c.get('vehicle_emission_reports')}, Samples='{c.get('data_samples')}', Status='{c.get('model_status')}', Updated='{c.get('last_updated')}'")

    # 6. POST Citizen Report Translation (Multilingual Gemini Parser)
    # Testing Hindi translation: "चौराहे के पास एक बस बहुत अधिक काला धुआं छोड़ रही है।"
    hi_trans_payload = json.dumps({
        "text": "चौराहे के पास एक बस बहुत अधिक काला धुआं छोड़ रही है।",
        "language": "Hindi"
    }).encode('utf-8')
    trans_res = test_endpoint(
        "POST /api/citizen-report/translate (Hindi -> Structured English Record)",
        f"{BASE_URL}/api/citizen-report/translate",
        method="POST",
        data=hi_trans_payload,
        headers={"Content-Type": "application/json"}
    )
    if trans_res:
        print(f"   -> Incident Type: {trans_res.get('incident_type')}")
        print(f"   -> Vehicle Type: {trans_res.get('vehicle_type')}")
        print(f"   -> Severity: {trans_res.get('severity')}")
        print(f"   -> Standardized English: {trans_res.get('description_english')}")

    # 7. POST Citizen Report Submission (with Gemini Vision assessment)
    report_data = json.dumps({
        "location": "Near Tolichowki Flyover, Hyderabad",
        "description": "Dense black diesel soot plume from heavy tipper truck stationary at intersection.",
        "severity": "Critical",
        "vehicle_type": "Heavy Commercial Tipper"
    }).encode('utf-8')
    post_cit_res = test_endpoint(
        "POST /api/citizen-report",
        f"{BASE_URL}/api/citizen-report",
        method="POST",
        data=report_data,
        headers={"Content-Type": "application/json"}
    )
    if post_cit_res and "data" in post_cit_res:
        cdata = post_cit_res["data"]
        print(f"   -> Message: {post_cit_res.get('message')}")
        print(f"   -> Report ID: {cdata.get('id')} | Status: {cdata.get('status')}")

    # 8. GET Citizen Reports
    test_endpoint("GET /api/citizen-report", f"{BASE_URL}/api/citizen-report")

    # 9. POST Vehicle Analyze (Multipart form-data)
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    body = io.BytesIO()
    body.write(f"--{boundary}\r\n".encode())
    body.write(b'Content-Disposition: form-data; name="file"; filename="heavy_diesel_truck.jpg"\r\n')
    body.write(b'Content-Type: image/jpeg\r\n\r\n')
    body.write(b'\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xFF\xDB\x00C\x00\xFF\xD9')
    body.write(f"\r\n--{boundary}--\r\n".encode())

    test_endpoint(
        "POST /api/vehicle/analyze",
        f"{BASE_URL}/api/vehicle/analyze",
        method="POST",
        data=body.getvalue(),
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )

    print("=" * 60)
    print("All Endpoint Tests Completed Successfully!")
    print("=" * 60)

if __name__ == "__main__":
    run_all_tests()
