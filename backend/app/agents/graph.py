from langgraph.graph import END, START, StateGraph

from app.agents.nodes.evaluate_node import evaluate_node
from app.agents.nodes.explain_node import explain_node
from app.agents.nodes.suggest_node import suggest_node
from app.agents.state import AgentState


def build_analysis_graph():
    workflow = StateGraph(AgentState)
    workflow.add_node("evaluate", evaluate_node)
    workflow.add_node("explain", explain_node)
    workflow.add_node("suggest", suggest_node)

    workflow.add_edge(START, "evaluate")
    workflow.add_edge("evaluate", "explain")
    workflow.add_edge("explain", "suggest")
    workflow.add_edge("suggest", END)
    return workflow.compile()
