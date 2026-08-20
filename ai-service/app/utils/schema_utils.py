import copy
from typing import Any


def flatten_json_schema(schema_dict: dict[str, Any]) -> dict[str, Any]:
    """
    Flattens a JSON Schema produced by Pydantic's model_json_schema()
    by resolving any `$ref` references inline using `$defs` definitions,
    removing top-level and nested `$defs`, `$schema`, and `title` keys,
    and ensuring all properties in objects are listed under `required` with
    `additionalProperties: False` for strict JSON Schema compatibility with Groq.
    """
    defs = schema_dict.get("$defs", {})

    def resolve(obj: Any) -> Any:
        if isinstance(obj, dict):
            if "$ref" in obj and len(obj) == 1:
                ref_path = obj["$ref"]
                if ref_path.startswith("#/$defs/"):
                    def_name = ref_path.split("/")[-1]
                    if def_name in defs:
                        return resolve(copy.deepcopy(defs[def_name]))
            
            res: dict[str, Any] = {}
            for k, v in obj.items():
                if k in ("title", "$defs", "$schema"):
                    continue
                res[k] = resolve(v)
            
            if res.get("type") == "object" and "properties" in res:
                res["required"] = list(res["properties"].keys())
                res["additionalProperties"] = False
            return res
        elif isinstance(obj, list):
            return [resolve(item) for item in obj]
        return obj

    return resolve(schema_dict)
