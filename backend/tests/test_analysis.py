from fastapi.testclient import TestClient

from app.main import app


def test_analysis_endpoint_success(monkeypatch):
    class FakeGraph:
        def invoke(self, state):
            return {
                **state,
                "best_move": "e7e5",
                "evaluation": 0.2,
                "explanation": "Solid central response.",
                "suggestion": "Continue development with Nc6.",
                "move_quality": "good",
            }

    monkeypatch.setattr("app.api.routes.analysis.build_analysis_graph", lambda: FakeGraph())

    client = TestClient(app)
    response = client.post("/analysis", json={"fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1", "move": "e7e5"})
    assert response.status_code == 200
    body = response.json()
    assert body["best_move"] == "e7e5"
    assert "evaluation" in body
    assert "explanation" in body
    assert "suggestion" in body
    assert body["move_quality"] == "good"


def test_analysis_endpoint_invalid_fen():
    client = TestClient(app)
    response = client.post("/analysis", json={"fen": "invalid-fen", "move": "e2e4"})
    assert response.status_code == 400
    assert "Invalid FEN" in response.json()["detail"]


def test_analysis_endpoint_illegal_move():
    client = TestClient(app)
    response = client.post("/analysis", json={"fen": "8/8/8/8/8/8/8/K6k w - - 0 1", "move": "e2e4"})
    assert response.status_code == 400
    assert "Illegal move" in response.json()["detail"]
