// Dữ liệu hóa học vô cơ - GDPT 2018 (70 PTHH hoàn toàn không trùng lặp)

const RELATION_DIAGRAM = {
  viewBox: { width: 1100, height: 700 },
  nodes: [
    {
      id: "metal",
      label: "Kim loại",
      sublabel: "Na, Mg, Fe, Cu...",
      x: 150,
      y: 120,
      color: "#2563eb",
      bg: "#eff6ff",
      extended: true,
      desc: "Đơn chất kim loại: có tính khử, tác dụng với oxygen, nước (kim loại kiềm/kiềm thổ), acid và dung dịch muối."
    },
    {
      id: "nonmetal",
      label: "Phi kim",
      sublabel: "O₂, Cl₂, S, P...",
      x: 950,
      y: 120,
      color: "#0d9488",
      bg: "#f0fdfa",
      extended: true,
      desc: "Đơn chất phi kim: tác dụng với oxygen tạo oxide acid, với hydrogen tạo acid không có oxygen, với kim loại tạo muối."
    },
    {
      id: "basic_oxide",
      label: "Oxide base",
      sublabel: "Na₂O, CaO, CuO, Fe₂O₃...",
      x: 270,
      y: 280,
      color: "#d97706",
      bg: "#fffbeb",
      extended: false,
      desc: "Oxide của kim loại (thường ở hóa trị thấp/trung bình), tác dụng với acid tạo muối và nước; một số oxide tan tác dụng với H₂O tạo kiềm."
    },
    {
      id: "acidic_oxide",
      label: "Oxide acid",
      sublabel: "CO₂, SO₂, SO₃, P₂O₅...",
      x: 830,
      y: 280,
      color: "#7c3aed",
      bg: "#f5f3ff",
      extended: false,
      desc: "Oxide của phi kim (hoặc kim loại hóa trị cao), tác dụng với dung dịch base tạo muối và nước; đa số tác dụng với H₂O tạo acid."
    },
    {
      id: "base",
      label: "Base",
      sublabel: "NaOH, Ca(OH)₂, Cu(OH)₂...",
      x: 270,
      y: 560,
      color: "#059669",
      bg: "#ecfdf5",
      extended: false,
      desc: "Gồm base tan (kiềm) và base không tan. Base không tan bị nhiệt phân tạo oxide base; base tác dụng với acid tạo muối."
    },
    {
      id: "acid",
      label: "Acid",
      sublabel: "HCl, H₂SO₄, HNO₃...",
      x: 830,
      y: 560,
      color: "#e11d48",
      bg: "#fff1f2",
      extended: false,
      desc: "Hợp chất có nguyên tử H liên kết với gốc acid. Tác dụng với kim loại, oxide base, base và nhiều muối."
    },
    {
      id: "salt",
      label: "Muối",
      sublabel: "NaCl, CaCO₃, FeCl₃...",
      x: 550,
      y: 425,
      color: "#4f46e5",
      bg: "#eef2ff",
      extended: false,
      desc: "Trung tâm chuyển hóa các hợp chất vô cơ. Muối có thể phản ứng với kim loại, acid, base (kiềm) và muối khác."
    }
  ],
  links: [
    {
      id: "r1",
      num: 1,
      from: "basic_oxide",
      to: "base",
      label: "+ H₂O",
      curveOffset: -36,
      extended: false,
      title: "Oxide base → Base",
      rule: "Oxide base của kim loại kiềm và kiềm thổ (Na₂O, K₂O, CaO, BaO) tác dụng với nước tạo thành dung dịch base (kiềm).",
      equations: [
        {
          raw: "Na2O + H2O -> 2NaOH",
          html: "Na<sub>2</sub>O + H<sub>2</sub>O → 2NaOH",
          cond: "Nhiệt độ thường",
          note: "Sodium oxide tan trong nước tạo dung dịch kiềm NaOH."
        },
        {
          raw: "CaO + H2O -> Ca(OH)2",
          html: "CaO + H<sub>2</sub>O → Ca(OH)<sub>2</sub>",
          cond: "Nhiệt độ thường",
          note: "Phản ứng tôi vôi, tỏa nhiều nhiệt."
        }
      ]
    },
    {
      id: "r2",
      num: 2,
      from: "base",
      to: "basic_oxide",
      label: "t°",
      curveOffset: -36,
      extended: false,
      title: "Base → Oxide base",
      rule: "Các base không tan trong nước bị nhiệt phân hủy thành oxide base tương ứng và hơi nước.",
      equations: [
        {
          raw: "Cu(OH)2 -> CuO + H2O",
          html: "Cu(OH)<sub>2</sub> → CuO + H<sub>2</sub>O",
          cond: "t°",
          note: "Kết tủa xanh lam chuyển thành chất rắn màu đen CuO."
        },
        {
          raw: "2Fe(OH)3 -> Fe2O3 + 3H2O",
          html: "2Fe(OH)<sub>3</sub> → Fe<sub>2</sub>O<sub>3</sub> + 3H<sub>2</sub>O",
          cond: "t°",
          note: "Kết tủa nâu đỏ chuyển thành chất rắn màu đỏ nâu Fe₂O₃."
        }
      ]
    },
    {
      id: "r3",
      num: 3,
      from: "acidic_oxide",
      to: "acid",
      label: "+ H₂O",
      curveOffset: 36,
      extended: false,
      title: "Oxide acid → Acid",
      rule: "Đa số oxide acid (trừ SiO₂) tác dụng với nước tạo thành dung dịch acid tương ứng.",
      equations: [
        {
          raw: "SO3 + H2O -> H2SO4",
          html: "SO<sub>3</sub> + H<sub>2</sub>O → H<sub>2</sub>SO<sub>4</sub>",
          cond: "Nhiệt độ thường",
          note: "Sulfur trioxide tác dụng mãnh liệt với nước tạo sulfuric acid."
        },
        {
          raw: "P2O5 + 3H2O -> 2H3PO4",
          html: "P<sub>2</sub>O<sub>5</sub> + 3H<sub>2</sub>O → 2H<sub>3</sub>PO<sub>4</sub>",
          cond: "Nhiệt độ thường",
          note: "Diphosphorus pentoxide háo nước, tạo phosphoric acid."
        }
      ]
    },
    {
      id: "r4",
      num: 4,
      from: "acid",
      to: "acidic_oxide",
      label: "Phân hủy / t°",
      curveOffset: 36,
      extended: false,
      title: "Acid → Oxide acid",
      rule: "Một số acid kém bền tự phân hủy ngay ở điều kiện thường hoặc khi đun nóng nhẹ để tạo oxide acid và nước.",
      equations: [
        {
          raw: "H2CO3 -> CO2 + H2O",
          html: "H<sub>2</sub>CO<sub>3</sub> → CO<sub>2</sub>↑ + H<sub>2</sub>O",
          cond: "Tự phân hủy",
          note: "Carbonic acid rất kém bền, phân hủy ngay thành khí CO₂ và nước."
        },
        {
          raw: "H2SiO3 -> SiO2 + H2O",
          html: "H<sub>2</sub>SiO<sub>3</sub> → SiO<sub>2</sub> + H<sub>2</sub>O",
          cond: "t°",
          note: "Silicic acid mất nước khi nung nóng tạo silicon dioxide."
        }
      ]
    },
    {
      id: "r5",
      num: 5,
      from: "basic_oxide",
      to: "salt",
      label: "+ Acid",
      curveOffset: 15,
      extended: false,
      title: "Oxide base → Muối",
      rule: "Oxide base tác dụng với dung dịch acid tạo thành muối và nước.",
      equations: [
        {
          raw: "CuO + 2HCl -> CuCl2 + H2O",
          html: "CuO + 2HCl → CuCl<sub>2</sub> + H<sub>2</sub>O",
          cond: "Nhiệt độ thường",
          note: "Bột CuO đen tan dần tạo dung dịch CuCl₂ màu xanh lam."
        },
        {
          raw: "Fe2O3 + 3H2SO4 -> Fe2(SO4)3 + 3H2O",
          html: "Fe<sub>2</sub>O<sub>3</sub> + 3H<sub>2</sub>SO<sub>4</sub> → Fe<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub> + 3H<sub>2</sub>O",
          cond: "Đun nhẹ",
          note: "Iron(III) oxide tan tạo dung dịch muối sắt(III) màu vàng nâu."
        }
      ]
    },
    {
      id: "r6",
      num: 6,
      from: "acidic_oxide",
      to: "salt",
      label: "+ Base",
      curveOffset: -15,
      extended: false,
      title: "Oxide acid → Muối",
      rule: "Oxide acid tác dụng với dung dịch base (kiềm) tạo thành muối và nước.",
      equations: [
        {
          raw: "CO2 + Ca(OH)2 -> CaCO3 + H2O",
          html: "CO<sub>2</sub> + Ca(OH)<sub>2</sub> → CaCO<sub>3</sub>↓ + H<sub>2</sub>O",
          cond: "Tỉ lệ mol 1:1",
          note: "Làm đục nước vôi trong do tạo kết tủa trắng CaCO₃."
        },
        {
          raw: "SO2 + 2NaOH -> Na2SO3 + H2O",
          html: "SO<sub>2</sub> + 2NaOH → Na<sub>2</sub>SO<sub>3</sub> + H<sub>2</sub>O",
          cond: "Kiềm dư",
          note: "Tạo muối trung hòa sodium sulfite."
        }
      ]
    },
    {
      id: "r7",
      num: 7,
      from: "basic_oxide",
      to: "acidic_oxide",
      label: "Oxide base + Oxide acid → Muối",
      curveOffset: -20,
      isBridgeToSalt: true,
      extended: false,
      title: "Oxide base + Oxide acid → Muối",
      rule: "Một số oxide base (của kim loại kiềm, kiềm thổ) tác dụng trực tiếp với oxide acid tạo thành muối.",
      equations: [
        {
          raw: "BaO + CO2 -> BaCO3",
          html: "BaO + CO<sub>2</sub> → BaCO<sub>3</sub>",
          cond: "t°",
          note: "Barium oxide kết hợp trực tiếp với CO₂ tạo barium carbonate."
        },
        {
          raw: "K2O + SO3 -> K2SO4",
          html: "K<sub>2</sub>O + SO<sub>3</sub> → K<sub>2</sub>SO<sub>4</sub>",
          cond: "t°",
          note: "Potassium oxide tác dụng với SO₃ tạo muối potassium sulfate."
        }
      ]
    },
    {
      id: "r8",
      num: 8,
      from: "base",
      to: "salt",
      label: "+ Acid",
      curveOffset: -28,
      extended: false,
      title: "Base → Muối",
      rule: "Base (tan hoặc không tan) tác dụng với acid (phản ứng trung hòa) tạo thành muối và nước.",
      equations: [
        {
          raw: "KOH + HNO3 -> KNO3 + H2O",
          html: "KOH + HNO<sub>3</sub> → KNO<sub>3</sub> + H<sub>2</sub>O",
          cond: "Nhiệt độ thường",
          note: "Phản ứng trung hòa giữa kiềm mạnh và acid mạnh."
        },
        {
          raw: "Mg(OH)2 + 2HCl -> MgCl2 + 2H2O",
          html: "Mg(OH)<sub>2</sub> + 2HCl → MgCl<sub>2</sub> + 2H<sub>2</sub>O",
          cond: "Nhiệt độ thường",
          note: "Base không tan Mg(OH)₂ hòa tan trong dung dịch HCl."
        }
      ]
    },
    {
      id: "r9",
      num: 9,
      from: "salt",
      to: "base",
      label: "+ Kiềm",
      curveOffset: -28,
      extended: false,
      title: "Muối → Base",
      rule: "Dung dịch muối tác dụng với dung dịch kiềm tạo thành muối mới và base mới (điều kiện: có chất kết tủa).",
      equations: [
        {
          raw: "CuSO4 + 2NaOH -> Cu(OH)2 + Na2SO4",
          html: "CuSO<sub>4</sub> + 2NaOH → Cu(OH)<sub>2</sub>↓ + Na<sub>2</sub>SO<sub>4</sub>",
          cond: "Dung dịch",
          note: "Xuất hiện kết tủa xanh lam Cu(OH)₂."
        },
        {
          raw: "FeCl3 + 3KOH -> Fe(OH)3 + 3KCl",
          html: "FeCl<sub>3</sub> + 3KOH → Fe(OH)<sub>3</sub>↓ + 3KCl",
          cond: "Dung dịch",
          note: "Xuất hiện kết tủa nâu đỏ Fe(OH)₃."
        }
      ]
    },
    {
      id: "r10",
      num: 10,
      from: "acid",
      to: "salt",
      label: "+ KL / Muối",
      curveOffset: 28,
      extended: false,
      title: "Acid → Muối",
      rule: "Acid tác dụng với kim loại đứng trước H (HCl, H₂SO₄ loãng) hoặc tác dụng với muối tạo thành muối mới.",
      equations: [
        {
          raw: "Zn + 2HCl -> ZnCl2 + H2",
          html: "Zn + 2HCl → ZnCl<sub>2</sub> + H<sub>2</sub>↑",
          cond: "Nhiệt độ thường",
          note: "Kim loại kẽm tan trong dung dịch HCl, sủi bọt khí hydrogen."
        },
        {
          raw: "H2SO4 + BaCl2 -> BaSO4 + 2HCl",
          html: "H<sub>2</sub>SO<sub>4</sub> + BaCl<sub>2</sub> → BaSO<sub>4</sub>↓ + 2HCl",
          cond: "Dung dịch",
          note: "Tạo kết tủa trắng BaSO₄ không tan trong acid."
        }
      ]
    },
    {
      id: "r11",
      num: 11,
      from: "salt",
      to: "acid",
      label: "+ Acid mạnh",
      curveOffset: 28,
      extended: false,
      title: "Muối → Acid",
      rule: "Muối tác dụng với dung dịch acid tạo muối mới và acid mới (điều kiện: sản phẩm có chất kết tủa, chất bay hơi hoặc acid yếu hơn).",
      equations: [
        {
          raw: "CaCO3 + 2HNO3 -> Ca(NO3)2 + CO2 + H2O",
          html: "CaCO<sub>3</sub> + 2HNO<sub>3</sub> → Ca(NO<sub>3</sub>)<sub>2</sub> + CO<sub>2</sub>↑ + H<sub>2</sub>O",
          cond: "Nhiệt độ thường",
          note: "Acid H₂CO₃ sinh ra không bền, phân hủy ngay thành khí CO₂ và H₂O."
        },
        {
          raw: "Na2SO3 + H2SO4 -> Na2SO4 + SO2 + H2O",
          html: "Na<sub>2</sub>SO<sub>3</sub> + H<sub>2</sub>SO<sub>4</sub> → Na<sub>2</sub>SO<sub>4</sub> + SO<sub>2</sub>↑ + H<sub>2</sub>O",
          cond: "Nhiệt độ thường",
          note: "Giải phóng khí SO₂ có mùi hắc."
        }
      ]
    },
    {
      id: "r12",
      num: 12,
      from: "salt",
      to: "salt",
      label: "+ Muối",
      curveOffset: 0,
      isSelfLoop: true,
      extended: false,
      title: "Muối → Muối",
      rule: "Hai dung dịch muối tác dụng với nhau tạo thành hai muối mới (điều kiện: ít nhất một muối mới tạo thành là chất kết tủa).",
      equations: [
        {
          raw: "AgNO3 + NaCl -> AgCl + NaNO3",
          html: "AgNO<sub>3</sub> + NaCl → AgCl↓ + NaNO<sub>3</sub>",
          cond: "Dung dịch",
          note: "Tạo kết tủa trắng bạc chloride AgCl."
        },
        {
          raw: "Ba(NO3)2 + Na2SO4 -> BaSO4 + 2NaNO3",
          html: "Ba(NO<sub>3</sub>)<sub>2</sub> + Na<sub>2</sub>SO<sub>4</sub> → BaSO<sub>4</sub>↓ + 2NaNO<sub>3</sub>",
          cond: "Dung dịch",
          note: "Tạo kết tủa trắng barium sulfate BaSO₄."
        }
      ]
    },
    {
      id: "r13",
      num: 13,
      from: "metal",
      to: "basic_oxide",
      label: "+ O₂",
      curveOffset: 0,
      extended: true,
      title: "Kim loại → Oxide base",
      rule: "Nhiều kim loại tác dụng trực tiếp với oxygen (thường cần đun nóng) tạo thành oxide base.",
      equations: [
        {
          raw: "2Mg + O2 -> 2MgO",
          html: "2Mg + O<sub>2</sub> → 2MgO",
          cond: "t°",
          note: "Magnesium cháy sáng chói trong không khí tạo bột trắng MgO."
        },
        {
          raw: "4Na + O2 -> 2Na2O",
          html: "4Na + O<sub>2</sub> → 2Na<sub>2</sub>O",
          cond: "Nhiệt độ thường (O₂ khô)",
          note: "Sodium dễ bị oxi hóa ngay ở nhiệt độ thường."
        }
      ]
    },
    {
      id: "r14",
      num: 14,
      from: "metal",
      to: "base",
      label: "+ H₂O",
      curveOffset: -115,
      extended: true,
      title: "Kim loại → Base",
      rule: "Kim loại kiềm (Li, Na, K...) và một số kim loại kiềm thổ (Ca, Ba) tác dụng với nước ở nhiệt độ thường tạo dung dịch kiềm và giải phóng khí H₂.",
      equations: [
        {
          raw: "2K + 2H2O -> 2KOH + H2",
          html: "2K + 2H<sub>2</sub>O → 2KOH + H<sub>2</sub>↑",
          cond: "Nhiệt độ thường",
          note: "Potassium phản ứng rất mạnh với nước, tỏa nhiệt lớn."
        },
        {
          raw: "Ba + 2H2O -> Ba(OH)2 + H2",
          html: "Ba + 2H<sub>2</sub>O → Ba(OH)<sub>2</sub> + H<sub>2</sub>↑",
          cond: "Nhiệt độ thường",
          note: "Barium tan trong nước tạo dung dịch Ba(OH)₂ và khí H₂."
        }
      ]
    },
    {
      id: "r15",
      num: 15,
      from: "metal",
      to: "salt",
      label: "+ Muối",
      curveOffset: -18,
      extended: true,
      title: "Kim loại → Muối",
      rule: "Kim loại hoạt động hóa học mạnh hơn (trừ kim loại kiềm/kiềm thổ tan trong nước) đẩy kim loại yếu hơn ra khỏi dung dịch muối.",
      equations: [
        {
          raw: "Fe + CuSO4 -> FeSO4 + Cu",
          html: "Fe + CuSO<sub>4</sub> → FeSO<sub>4</sub> + Cu↓",
          cond: "Dung dịch",
          note: "Đinh sắt có lớp đồng màu đỏ bám ngoài, dung dịch nhạt màu xanh."
        },
        {
          raw: "Cu + 2AgNO3 -> Cu(NO3)2 + 2Ag",
          html: "Cu + 2AgNO<sub>3</sub> → Cu(NO<sub>3</sub>)<sub>2</sub> + 2Ag↓",
          cond: "Dung dịch",
          note: "Dây đồng phủ lớp bạc trắng xám, dung dịch chuyển màu xanh lam."
        }
      ]
    },
    {
      id: "r16",
      num: 16,
      from: "nonmetal",
      to: "acidic_oxide",
      label: "+ O₂",
      curveOffset: 0,
      extended: true,
      title: "Phi kim → Oxide acid",
      rule: "Nhiều phi kim (C, S, P...) cháy trong khí oxygen tạo thành oxide acid.",
      equations: [
        {
          raw: "S + O2 -> SO2",
          html: "S + O<sub>2</sub> → SO<sub>2</sub>",
          cond: "t°",
          note: "Lưu huỳnh cháy với ngọn lửa xanh mờ tạo khí SO₂."
        },
        {
          raw: "4P + 5O2 -> 2P2O5",
          html: "4P + 5O<sub>2</sub> → 2P<sub>2</sub>O<sub>5</sub>",
          cond: "t°",
          note: "Phosphorus cháy tạo khói trắng dày đặc P₂O₅."
        }
      ]
    },
    {
      id: "r17",
      num: 17,
      from: "nonmetal",
      to: "acid",
      label: "+ H₂",
      curveOffset: 115,
      extended: true,
      title: "Phi kim → Acid",
      rule: "Một số phi kim (Cl₂, Br₂, S...) tác dụng với khí hydrogen tạo thành hợp chất khí, khi tan trong nước tạo dung dịch acid không có oxygen.",
      equations: [
        {
          raw: "H2 + Cl2 -> 2HCl",
          html: "H<sub>2</sub> + Cl<sub>2</sub> → 2HCl",
          cond: "Ánh sáng / t°",
          note: "Khí hydrogen chloride tan vào nước tạo hydrochloric acid."
        },
        {
          raw: "H2 + S -> H2S",
          html: "H<sub>2</sub> + S → H<sub>2</sub>S",
          cond: "t°",
          note: "Tạo khí hydrogen sulfide (tan trong nước tạo acid yếu H₂S)."
        }
      ]
    },
    {
      id: "r18",
      num: 18,
      from: "nonmetal",
      to: "salt",
      label: "+ Kim loại",
      curveOffset: 18,
      extended: true,
      title: "Phi kim → Muối",
      rule: "Phi kim (halogen, lưu huỳnh...) tác dụng trực tiếp với kim loại ở nhiệt độ thích hợp tạo thành muối không có oxygen.",
      equations: [
        {
          raw: "2Fe + 3Cl2 -> 2FeCl3",
          html: "2Fe + 3Cl<sub>2</sub> → 2FeCl<sub>3</sub>",
          cond: "t°",
          note: "Chlorine là chất oxi hóa mạnh, oxi hóa sắt lên số oxi hóa +3."
        },
        {
          raw: "2Al + 3S -> Al2S3",
          html: "2Al + 3S → Al<sub>2</sub>S<sub>3</sub>",
          cond: "t°",
          note: "Nhôm tác dụng với lưu huỳnh khi đun nóng tạo aluminium sulfide."
        }
      ]
    }
  ]
};

// Sơ đồ 2: Sơ đồ tư duy điều chế muối vô cơ (5 nhánh chính, 17 phương pháp, 34 PTHH duy nhất)
const SALT_MINDMAP = {
  center: {
    id: "salt_center",
    title: "ĐIỀU CHẾ MUỐI VÔ CƠ",
    subtitle: "5 nhóm phương pháp • 17 hướng • 34 PTHH"
  },
  branches: [
    {
      id: "b1",
      side: "left",
      title: "1. Từ Kim loại",
      color: "#2563eb",
      bg: "#eff6ff",
      methods: [
        {
          id: "m1",
          title: "Kim loại + Phi kim",
          rule: "Kim loại tác dụng trực tiếp với phi kim (Cl₂, Br₂, S...) tạo muối không chứa oxygen.",
          equations: [
            {
              raw: "2Na + Cl2 -> 2NaCl",
              html: "2Na + Cl<sub>2</sub> → 2NaCl",
              cond: "t°",
              note: "Natri cháy trong khí chlorine tạo muối ăn NaCl."
            },
            {
              raw: "Fe + S -> FeS",
              html: "Fe + S → FeS",
              cond: "t°",
              note: "Sắt tác dụng với lưu huỳnh chỉ lên muối sắt(II) sulfide."
            }
          ]
        },
        {
          id: "m2",
          title: "Kim loại + Acid loãng",
          rule: "Kim loại đứng trước H trong dãy hoạt động tác dụng với HCl, H₂SO₄ loãng tạo muối và giải phóng khí H₂.",
          equations: [
            {
              raw: "Fe + 2HCl -> FeCl2 + H2",
              html: "Fe + 2HCl → FeCl<sub>2</sub> + H<sub>2</sub>↑",
              cond: "Nhiệt độ thường",
              note: "Sắt tác dụng với HCl chỉ tạo muối sắt(II) chloride."
            },
            {
              raw: "2Al + 3H2SO4 -> Al2(SO4)3 + 3H2",
              html: "2Al + 3H<sub>2</sub>SO<sub>4</sub>(loãng) → Al<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub> + 3H<sub>2</sub>↑",
              cond: "Nhiệt độ thường",
              note: "Nhôm tan nhanh trong dung dịch H₂SO₄ loãng."
            }
          ]
        },
        {
          id: "m3",
          title: "Kim loại + Acid oxi hóa mạnh",
          rule: "Kim loại (trừ Au, Pt) tác dụng với HNO₃ hoặc H₂SO₄ đặc nóng tạo muối (hóa trị cao), sản phẩm khử và H₂O (không giải phóng H₂).",
          equations: [
            {
              raw: "Cu + 4HNO3 -> Cu(NO3)2 + 2NO2 + 2H2O",
              html: "Cu + 4HNO<sub>3</sub>(đặc) → Cu(NO<sub>3</sub>)<sub>2</sub> + 2NO<sub>2</sub>↑ + 2H<sub>2</sub>O",
              cond: "Nhiệt độ thường",
              note: "Giải phóng khí NO₂ màu nâu đỏ, dung dịch chuyển xanh lam."
            },
            {
              raw: "2Fe + 6H2SO4 -> Fe2(SO4)3 + 3SO2 + 6H2O",
              html: "2Fe + 6H<sub>2</sub>SO<sub>4</sub>(đặc) → Fe<sub>2</sub>(SO<sub>4</sub>)<sub>3</sub> + 3SO<sub>2</sub>↑ + 6H<sub>2</sub>O",
              cond: "t°",
              note: "Sắt bị oxi hóa lên mức +3 trong H₂SO₄ đặc, nóng."
            }
          ]
        },
        {
          id: "m4",
          title: "Kim loại + Dung dịch Muối",
          rule: "Kim loại mạnh đẩy kim loại yếu hơn ra khỏi muối, hoặc kim loại khử muối sắt(III) về muối sắt(II).",
          equations: [
            {
              raw: "Zn + Pb(NO3)2 -> Zn(NO3)2 + Pb",
              html: "Zn + Pb(NO<sub>3</sub>)<sub>2</sub> → Zn(NO<sub>3</sub>)<sub>2</sub> + Pb↓",
              cond: "Dung dịch",
              note: "Kẽm đẩy chì ra khỏi dung dịch muối nitrate."
            },
            {
              raw: "Fe + 2FeCl3 -> 3FeCl2",
              html: "Fe + 2FeCl<sub>3</sub> → 3FeCl<sub>2</sub>",
              cond: "Dung dịch",
              note: "Sắt khử ion Fe³⁺ thành Fe²⁺ tạo muối FeCl₂."
            }
          ]
        },
        {
          id: "m5",
          title: "Kim loại lưỡng tính + Kiềm",
          rule: "Các kim loại có hydroxide lưỡng tính (Al, Zn) tan được trong dung dịch kiềm tạo muối aluminate / zincate và khí H₂.",
          equations: [
            {
              raw: "2Al + 2NaOH + 2H2O -> 2NaAlO2 + 3H2",
              html: "2Al + 2NaOH + 2H<sub>2</sub>O → 2NaAlO<sub>2</sub> + 3H<sub>2</sub>↑",
              cond: "Dung dịch",
              note: "Nhôm tan trong dung dịch NaOH tạo sodium aluminate."
            },
            {
              raw: "Zn + 2KOH -> K2ZnO2 + H2",
              html: "Zn + 2KOH → K<sub>2</sub>ZnO<sub>2</sub> + H<sub>2</sub>↑",
              cond: "t° / Kiềm đặc",
              note: "Kẽm tác dụng với kiềm tạo muối potassium zincate."
            }
          ]
        }
      ]
    },
    {
      id: "b2",
      side: "left",
      title: "2. Từ Oxide",
      color: "#d97706",
      bg: "#fffbeb",
      methods: [
        {
          id: "m6",
          title: "Oxide base + Acid",
          rule: "Oxide base tác dụng với dung dịch acid tạo thành muối tương ứng và nước.",
          equations: [
            {
              raw: "MgO + 2HNO3 -> Mg(NO3)2 + H2O",
              html: "MgO + 2HNO<sub>3</sub> → Mg(NO<sub>3</sub>)<sub>2</sub> + H<sub>2</sub>O",
              cond: "Nhiệt độ thường",
              note: "Magnesium oxide tan tạo dung dịch Mg(NO₃)₂ không màu."
            },
            {
              raw: "FeO + H2SO4 -> FeSO4 + H2O",
              html: "FeO + H<sub>2</sub>SO<sub>4</sub>(loãng) → FeSO<sub>4</sub> + H<sub>2</sub>O",
              cond: "Nhiệt độ thường",
              note: "Giữ nguyên số oxi hóa +2 của sắt tạo muối FeSO₄."
            }
          ]
        },
        {
          id: "m7",
          title: "Oxide acid + Base (kiềm)",
          rule: "Oxide acid tác dụng với dung dịch kiềm tạo muối (trung hòa hoặc muối acid tùy tỉ lệ mol) và nước.",
          equations: [
            {
              raw: "P2O5 + 6NaOH -> 2Na3PO4 + 3H2O",
              html: "P<sub>2</sub>O<sub>5</sub> + 6NaOH → 2Na<sub>3</sub>PO<sub>4</sub> + 3H<sub>2</sub>O",
              cond: "Kiềm dư",
              note: "Tạo muối trung hòa trisodium phosphate."
            },
            {
              raw: "CO2 + 2KOH -> K2CO3 + H2O",
              html: "CO<sub>2</sub> + 2KOH → K<sub>2</sub>CO<sub>3</sub> + H<sub>2</sub>O",
              cond: "Tỉ lệ mol 1:2",
              note: "Tạo muối trung hòa potassium carbonate."
            }
          ]
        },
        {
          id: "m8",
          title: "Oxide base + Oxide acid",
          rule: "Oxide base của kim loại hoạt động mạnh kết hợp trực tiếp với oxide acid tạo muối.",
          equations: [
            {
              raw: "CaO + CO2 -> CaCO3",
              html: "CaO + CO<sub>2</sub> → CaCO<sub>3</sub>",
              cond: "t°",
              note: "Vôi sống hấp thụ khí CO₂ tạo đá vôi."
            },
            {
              raw: "Na2O + SO2 -> Na2SO3",
              html: "Na<sub>2</sub>O + SO<sub>2</sub> → Na<sub>2</sub>SO<sub>3</sub>",
              cond: "t°",
              note: "Kết hợp trực tiếp tạo muối sodium sulfite."
            }
          ]
        },
        {
          id: "m9",
          title: "Oxide lưỡng tính + Kiềm",
          rule: "Oxide lưỡng tính (Al₂O₃, ZnO...) tác dụng được với cả acid mạnh lẫn dung dịch kiềm tạo muối và nước.",
          equations: [
            {
              raw: "Al2O3 + 2NaOH -> 2NaAlO2 + H2O",
              html: "Al<sub>2</sub>O<sub>3</sub> + 2NaOH → 2NaAlO<sub>2</sub> + H<sub>2</sub>O",
              cond: "Dung dịch / t°",
              note: "Ứng dụng để tinh chế quặng bauxite (Al₂O₃)."
            },
            {
              raw: "ZnO + 2KOH -> K2ZnO2 + H2O",
              html: "ZnO + 2KOH → K<sub>2</sub>ZnO<sub>2</sub> + H<sub>2</sub>O",
              cond: "Dung dịch",
              note: "Zinc oxide tan trong dung dịch KOH tạo muối zincate."
            }
          ]
        }
      ]
    },
    {
      id: "b3",
      side: "left",
      title: "3. Từ Base & Acid",
      color: "#059669",
      bg: "#ecfdf5",
      methods: [
        {
          id: "m10",
          title: "Base + Acid (Trung hòa)",
          rule: "Phản ứng giữa base và acid luôn xảy ra để tạo thành muối và nước.",
          equations: [
            {
              raw: "NaOH + HCl -> NaCl + H2O",
              html: "NaOH + HCl → NaCl + H<sub>2</sub>O",
              cond: "Nhiệt độ thường",
              note: "Phản ứng trung hòa kinh điển tạo muối NaCl."
            },
            {
              raw: "Ca(OH)2 + H2SO4 -> CaSO4 + 2H2O",
              html: "Ca(OH)<sub>2</sub> + H<sub>2</sub>SO<sub>4</sub> → CaSO<sub>4</sub> + 2H<sub>2</sub>O",
              cond: "Nhiệt độ thường",
              note: "Tạo muối ít tan calcium sulfate và nước."
            }
          ]
        },
        {
          id: "m11",
          title: "Base (kiềm) + Muối",
          rule: "Dung dịch kiềm tác dụng với dung dịch muối tạo muối mới và base mới (phải có chất kết tủa).",
          equations: [
            {
              raw: "Ba(OH)2 + Na2SO4 -> BaSO4 + 2NaOH",
              html: "Ba(OH)<sub>2</sub> + Na<sub>2</sub>SO<sub>4</sub> → BaSO<sub>4</sub>↓ + 2NaOH",
              cond: "Dung dịch",
              note: "Tạo kết tủa trắng BaSO₄ và dung dịch kiềm NaOH."
            },
            {
              raw: "2KOH + MgCl2 -> Mg(OH)2 + 2KCl",
              html: "2KOH + MgCl<sub>2</sub> → Mg(OH)<sub>2</sub>↓ + 2KCl",
              cond: "Dung dịch",
              note: "Tạo kết tủa trắng Mg(OH)₂ và muối KCl."
            }
          ]
        },
        {
          id: "m12",
          title: "Acid + Muối",
          rule: "Acid tác dụng với muối tạo muối mới và acid mới (điều kiện: có kết tủa hoặc khí bay ra).",
          equations: [
            {
              raw: "2HCl + Na2CO3 -> 2NaCl + CO2 + H2O",
              html: "2HCl + Na<sub>2</sub>CO<sub>3</sub> → 2NaCl + CO<sub>2</sub>↑ + H<sub>2</sub>O",
              cond: "Nhiệt độ thường",
              note: "Sủi bọt khí CO₂ mạnh, tạo muối NaCl."
            },
            {
              raw: "H2SO4 + Ba(NO3)2 -> BaSO4 + 2HNO3",
              html: "H<sub>2</sub>SO<sub>4</sub> + Ba(NO<sub>3</sub>)<sub>2</sub> → BaSO<sub>4</sub>↓ + 2HNO<sub>3</sub>",
              cond: "Dung dịch",
              note: "Tạo kết tủa BaSO₄ không tan và acid HNO₃."
            }
          ]
        }
      ]
    },
    {
      id: "b4",
      side: "right",
      title: "4. Từ Muối (Chuyển hóa)",
      color: "#4f46e5",
      bg: "#eef2ff",
      methods: [
        {
          id: "m13",
          title: "Muối + Muối (Trao đổi)",
          rule: "Hai dung dịch muối phản ứng với nhau tạo 2 muối mới khi có ít nhất 1 muối kết tủa.",
          equations: [
            {
              raw: "CaCl2 + Na2CO3 -> CaCO3 + 2NaCl",
              html: "CaCl<sub>2</sub> + Na<sub>2</sub>CO<sub>3</sub> → CaCO<sub>3</sub>↓ + 2NaCl",
              cond: "Dung dịch",
              note: "Phản ứng làm mềm nước cứng, tạo kết tủa trắng CaCO₃."
            },
            {
              raw: "Pb(NO3)2 + Na2S -> PbS + 2NaNO3",
              html: "Pb(NO<sub>3</sub>)<sub>2</sub> + Na<sub>2</sub>S → PbS↓ + 2NaNO<sub>3</sub>",
              cond: "Dung dịch",
              note: "Tạo kết tủa màu đen PbS."
            }
          ]
        },
        {
          id: "m14",
          title: "Nhiệt phân muối",
          rule: "Một số muối chứa oxygen (KClO₃, KMnO₄, muối nitrate, muối hydrocarbonate...) bị nhiệt phân tạo muối mới.",
          equations: [
            {
              raw: "2KClO3 -> 2KCl + 3O2",
              html: "2KClO<sub>3</sub> → 2KCl + 3O<sub>2</sub>↑",
              cond: "t°, xúc tác MnO₂",
              note: "Điều chế khí oxygen trong phòng thí nghiệm, thu được muối KCl."
            },
            {
              raw: "2KMnO4 -> K2MnO4 + MnO2 + O2",
              html: "2KMnO<sub>4</sub> → K<sub>2</sub>MnO<sub>4</sub> + MnO<sub>2</sub> + O<sub>2</sub>↑",
              cond: "t°",
              note: "Nhiệt phân thuốc tím tạo muối potassium manganate."
            }
          ]
        },
        {
          id: "m15",
          title: "Muối acid ↔ Muối trung hòa",
          rule: "Muối acid tác dụng với kiềm tạo muối trung hòa; ngược lại muối trung hòa kết hợp CO₂ + H₂O tạo muối acid.",
          equations: [
            {
              raw: "NaHCO3 + NaOH -> Na2CO3 + H2O",
              html: "NaHCO<sub>3</sub> + NaOH → Na<sub>2</sub>CO<sub>3</sub> + H<sub>2</sub>O",
              cond: "Dung dịch",
              note: "Chuyển hóa muối hydrocarbonate thành muối carbonate trung hòa."
            },
            {
              raw: "CaCO3 + CO2 + H2O -> Ca(HCO3)2",
              html: "CaCO<sub>3</sub> + CO<sub>2</sub> + H<sub>2</sub>O → Ca(HCO<sub>3</sub>)<sub>2</sub>",
              cond: "Nhiệt độ thường",
              note: "Giải thích sự xâm thực đá vôi tạo hang động thạch nhũ."
            }
          ]
        }
      ]
    },
    {
      id: "b5",
      side: "right",
      title: "5. Phương pháp đặc biệt",
      color: "#0d9488",
      bg: "#f0fdfa",
      methods: [
        {
          id: "m16",
          title: "Phi kim + Dung dịch Kiềm",
          rule: "Một số phi kim (Cl₂, Br₂, I₂) tự oxi hóa - khử trong dung dịch kiềm tạo hỗn hợp 2 muối và nước.",
          equations: [
            {
              raw: "Cl2 + 2NaOH -> NaCl + NaClO + H2O",
              html: "Cl<sub>2</sub> + 2NaOH → NaCl + NaClO + H<sub>2</sub>O",
              cond: "Nhiệt độ thường",
              note: "Sản xuất nước Javel dùng để tẩy trắng, sát trùng."
            },
            {
              raw: "3Cl2 + 6KOH -> 5KCl + KClO3 + 3H2O",
              html: "3Cl<sub>2</sub> + 6KOH → 5KCl + KClO<sub>3</sub> + 3H<sub>2</sub>O",
              cond: "t° (~70-100°C)",
              note: "Điều chế muối potassium chlorate (KClO₃)."
            }
          ]
        },
        {
          id: "m17",
          title: "Oxi hóa - khử từ Muối & Phi kim",
          rule: "Halogen mạnh đẩy halogen yếu khỏi muối, hoặc chất oxi hóa mạnh nâng số oxi hóa của ion kim loại trong muối.",
          equations: [
            {
              raw: "Cl2 + 2NaBr -> 2NaCl + Br2",
              html: "Cl<sub>2</sub> + 2NaBr → 2NaCl + Br<sub>2</sub>",
              cond: "Dung dịch",
              note: "Chlorine hoạt động mạnh hơn đẩy bromine ra khỏi muối NaBr."
            },
            {
              raw: "2FeCl2 + Cl2 -> 2FeCl3",
              html: "2FeCl<sub>2</sub> + Cl<sub>2</sub> → 2FeCl<sub>3</sub>",
              cond: "Dung dịch / t°",
              note: "Khí chlorine oxi hóa muối sắt(II) thành muối sắt(III)."
            }
          ]
        }
      ]
    }
  ]
};
