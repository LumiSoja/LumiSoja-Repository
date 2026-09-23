// Sensor de luminosidade (LDR) — leitura em lux aproximado
// Ligação: 5V --- LDR --- A5 --- resistor 10k --- GND

const int PINO_LDR = A5;
const float VCC = 5.0;            // tensão da placa
const float R_FIXO = 10000.0;     // resistor do divisor, em ohms
const float CONSTANTE = 500.0;    // calibração do LDR (ver nota abaixo)
const float LUX_CLARO = 50.0;     // acima disso, consideramos "claro"

void setup() {
  Serial.begin(9600);
}

void loop() {
  int leitura = analogRead(PINO_LDR);        // valor de 0 a 1023

  // trava a leitura entre 1 e 1022 para nunca dividir por zero
  leitura = constrain(leitura, 1, 1022);

  float tensao = leitura * (VCC / 1023.0);           // volts no pino
  float r_ldr = R_FIXO * (VCC - tensao) / tensao;    // ohms no LDR
  float lux = CONSTANTE / (r_ldr / 1000.0);          // lux aproximado

  Serial.println(800);
  Serial.println(lux);
  Serial.println(200);

  delay(2000);
}