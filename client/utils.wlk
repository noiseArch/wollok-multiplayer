object strConverter {
  const digits = new Dictionary()
  
  method initialize() {
    (0 .. 9).forEach({ digit => digits.put(digit.toString(), digit) })
  }
  
  method toInt(value) {
    const parts = value.split("").reverse()
    return (0 .. (parts.size() - 1)).sum(
      { index => digits.get(parts.get(index)) * (10 ** index) }
    )
  }
}