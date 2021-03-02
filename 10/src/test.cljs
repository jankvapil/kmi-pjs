
"foo"   ;; řetězec
\f      ;; znak
42      ;; celé číslo
42N     ;; velké celé číslo
3.14    ;; číslo s plovoucí řádovou čárkou
3.14M   ;; velké číslo s plovoucí řádovou čárkou
true    ;; pravdivostní hodnota
nil     ;; null
+       ;; symbol
:foo    ;; klíčové slovo


;; seznam - sekvenční přístup
(+ 2 3)

;; vektor - sekvenční / náhodný přístup
[2 3]

;; mapa - asociativní pole
{:a 1 :b 2}

;; množina
#{:a :b :c}


(defn add 
  "funkce sečte 2 čísla"
  [x y] 
  (+ x y))

(println (add 1 2))