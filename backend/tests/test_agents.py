from app.agents.graph import build_analysis_graph
from app.services.evaluation_service import classify_move


def test_classify_move():
    assert classify_move("e2e4", "e2e4", 0.1) == "excellent"
    assert classify_move("d2d4", "e2e4", 0.5) == "good"
    assert classify_move("a2a3", "e2e4", 2.0) == "inaccuracy"
    assert classify_move("h2h3", "e2e4", 3.2) == "mistake"
    assert classify_move("f2f3", "e2e4", 6.5) == "blunder"


def test_agent_flow(monkeypatch):
    def fake_evaluate(state):
        state["best_move"] = "e7e5"
        state["evaluation"] = 1.2
        state["move_quality"] = "inaccuracy"
        return state

    def fake_explain(state):
        state["explanation"] = "You gave up center control."
        return state

    def fake_suggest(state):
        state["suggestion"] = "Play e7e5 to contest the center."
        return state

    monkeypatch.setattr("app.agents.graph.evaluate_node", fake_evaluate)
    monkeypatch.setattr("app.agents.graph.explain_node", fake_explain)
    monkeypatch.setattr("app.agents.graph.suggest_node", fake_suggest)

    graph = build_analysis_graph()
    result = graph.invoke(
        {
            "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
            "user_move": "a7a6",
            "best_move": "",
            "evaluation": 0.0,
            "explanation": "",
            "suggestion": "",
            "move_quality": "good",
        }
    )
    assert result["best_move"] == "e7e5"
    assert result["move_quality"] == "inaccuracy"
    assert "center" in result["explanation"].lower()
    assert "e7e5" in result["suggestion"]
