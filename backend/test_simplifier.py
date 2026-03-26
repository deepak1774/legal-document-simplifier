import traceback
try:
    from simplifier import simplify_text, detect_risks  # type: ignore
    text = "This is a dummy contract. \f The parties hereby agree to arbitration. Upon termination, a penalty will be enforced."
    print("Testing simplify_text...")
    res = simplify_text(text)
    print(res)
    print("Testing detect_risks...")
    res2 = detect_risks(text)
    print(res2)
except Exception as e:
    traceback.print_exc()
