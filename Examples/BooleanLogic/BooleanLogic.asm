.text
.globl main
main: 
ori $s0, 100
ori $s1, 101
ori $s2, 1
xor $t0, $s0, $s1
andi $t1, $s2, 1
and $t2, $t0, $t1
end: j end
