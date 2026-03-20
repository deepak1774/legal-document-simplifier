from fpdf import FPDF
pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=15)
pdf.cell(200, 10, txt="Confidentiality and Termination Agreement", ln=1, align='C')
pdf.set_font("Arial", size=12)
pdf.multi_cell(0, 10, "1. Termination\nEither party may terminate this agreement at any time with 30 days written notice. This constitutes a high risk of termination.\n\n2. Liability\nThe maximum liability under this contract is $1,000,000.\n\n3. Auto-renewal\nThis contract renews automatically every year unless cancelled.")
pdf.output("dummy_contract.pdf")
