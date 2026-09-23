import os
import re
import yaml
from typing import List, Dict, Any

NEGATION_PATTERNS = [
    r'(?i)\bdo\s+not\s+',
    r'(?i)\bnever\s+',
    r'(?i)\bdon\'?t\s+',
    r'(?i)\bshould\s+not\s+',
    r'(?i)\bन\s+करें\b',
    r'(?i)\bन\s+दें\b',
    r'(?i)\bसाझा\s+न\s+करें\b',
    r'(?i)\bसांगू\s+नका\b',
    r'(?i)\bदेऊ\s+नका\b',
    r'(?i)\bशेअर\s+करू\s+नका\b'
]

class RulesEngine:
    def __init__(self, rules_filepath: str = None):
        if not rules_filepath:
            # Default path relative to repository root
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
            rules_filepath = os.path.join(base_dir, "rules", "scam_rules.v1.yaml")
        
        self.rules_filepath = rules_filepath
        self.rules = self._load_rules()

    def _load_rules(self) -> List[Dict[str, Any]]:
        if not os.path.exists(self.rules_filepath):
            return []
        with open(self.rules_filepath, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
            return data.get("rules", [])

    def evaluate(self, text: str, lang: str = "en") -> Dict[str, Any]:
        """
        Evaluate text against rules.
        Returns:
            {
                "triggered_rules": [...],
                "rule_score": int (0-100),
                "hard_override": bool,
                "category_hints": [...]
            }
        """
        triggered = []
        total_weight = 0
        hard_override = False
        category_hints = []

        for rule in self.rules:
            patterns = rule.get("patterns", {}).get(lang, []) + rule.get("patterns", {}).get("en", [])
            for pattern_str in patterns:
                try:
                    pattern = re.compile(pattern_str, re.IGNORECASE)
                    match = pattern.search(text)
                    if match:
                        start, end = match.span()
                        context_window = text[max(0, start - 30):start]
                        
                        # Check if negated (e.g. "Do not share OTP")
                        is_negated = any(re.search(neg, context_window) for neg in NEGATION_PATTERNS)
                        
                        if not is_negated:
                            weight = rule.get("weight", 50)
                            triggered.append({
                                "rule_id": rule["id"],
                                "weight": weight,
                                "matched_span": match.group(0),
                                "explanation": rule.get("explanation", {}),
                                "category_hint": rule.get("category_hint", "other_suspicious")
                            })
                            total_weight += weight
                            if rule.get("category_hint"):
                                category_hints.append(rule["category_hint"])
                            if rule.get("hard_override", False):
                                hard_override = True
                            break # Count rule only once per text
                except Exception:
                    continue

        # Cap rule score at 100
        rule_score = min(100, total_weight)
        
        return {
            "triggered_rules": triggered,
            "rule_score": rule_score,
            "hard_override": hard_override,
            "category_hints": category_hints
        }
