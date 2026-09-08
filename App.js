import React, {useMemo, useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {
  SafeAreaView, View, Text, TextInput, Pressable, ScrollView,
  StyleSheet, I18nManager, Alert
} from 'react-native';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const GREEN = '#12D88A';
const DARK = '#06130F';
const CARD = '#0D211B';
const MUTED = '#91A9A1';
const WHITE = '#F7FFFC';

const products = [
  {name:'iPhone 15 Pro', price:850000, average:900000, category:'هواتف'},
  {name:'Galaxy S24', price:720000, average:760000, category:'هواتف'},
  {name:'MacBook Air M2', price:1350000, average:1420000, category:'لابتوبات'},
  {name:'AirPods Pro', price:420000, average:460000, category:'إلكترونيات'},
];

function money(n){ return `${Math.round(n).toLocaleString('en-US')} د.ع`; }

function Logo(){
  return (
    <View style={styles.logoRow}>
      <View style={styles.logoMark}><Text style={styles.logoCheck}>✓</Text></View>
      <Text style={styles.logoText}>يسوى</Text>
    </View>
  );
}

function Pill({children, active=false, onPress}){
  return <Pressable onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
    <Text style={[styles.pillText, active && styles.pillTextActive]}>{children}</Text>
  </Pressable>
}

function Home({go}){
  const [q,setQ]=useState('');
  const filtered = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.includes(q));
  return <ScrollView contentContainerStyle={styles.content}>
    <View style={styles.header}><Logo/><Text style={styles.bell}>◉</Text></View>
    <Text style={styles.title}>نفس المنتج..{'\n'}أسعار مختلفة</Text>
    <Text style={styles.subtitle}>خلّي القرار بيدك، واعرف إذا السعر يسوى قبل ما تشتري.</Text>

    <View style={styles.search}>
      <Text style={styles.searchIcon}>⌕</Text>
      <TextInput
        value={q} onChangeText={setQ}
        placeholder="ابحث عن منتج..."
        placeholderTextColor="#6D837B"
        style={styles.searchInput}
      />
    </View>

    <Pressable style={styles.hero} onPress={()=>go('evaluate')}>
      <View>
        <Text style={styles.heroTitle}>هل هذا السعر مناسب؟</Text>
        <Text style={styles.heroText}>صوّر المنتج أو أدخل بياناته</Text>
        <View style={styles.primaryBtn}><Text style={styles.primaryBtnText}>ابدأ التقييم ←</Text></View>
      </View>
      <Text style={styles.heroTag}>✓</Text>
    </Pressable>

    <Text style={styles.sectionTitle}>الأكثر بحثًا</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:10}}>
      {['هواتف','إلكترونيات','لابتوبات','أجهزة منزلية'].map((x,i)=><Pill key={x}>{x}</Pill>)}
    </ScrollView>

    <View style={styles.rowBetween}>
      <Text style={styles.sectionTitle}>أفضل العروض</Text>
      <Pressable onPress={()=>go('compare')}><Text style={styles.link}>عرض الكل</Text></Pressable>
    </View>

    {filtered.map(p=><Pressable key={p.name} style={styles.productCard} onPress={()=>go('result',p)}>
      <View style={styles.productIcon}><Text style={{fontSize:22}}>▣</Text></View>
      <View style={{flex:1}}>
        <Text style={styles.productName}>{p.name}</Text>
        <Text style={styles.muted}>{p.category} • مستعمل/جديد</Text>
      </View>
      <View style={{alignItems:'flex-end'}}>
        <Text style={styles.price}>{money(p.price)}</Text>
        <Text style={styles.goodSmall}>سعر جيد</Text>
      </View>
    </Pressable>)}
  </ScrollView>
}

function Evaluate({go}){
  const [name,setName]=useState('iPhone 15 Pro');
  const [price,setPrice]=useState('850000');
  return <ScrollView contentContainerStyle={styles.content}>
    <Pressable onPress={()=>go('home')}><Text style={styles.back}>→ الرئيسية</Text></Pressable>
    <Text style={styles.pageTitle}>تقييم السعر</Text>
    <Text style={styles.subtitle}>أدخل المنتج والسعر وسنخبرك هل الصفقة تستحق.</Text>

    <View style={styles.cameraBox}>
      <Text style={styles.cameraIcon}>▣</Text>
      <Text style={styles.cameraTitle}>التقط صورة للمنتج</Text>
      <Text style={styles.muted}>ميزة التصوير ستصبح متاحة في النسخة القادمة</Text>
    </View>

    <Text style={styles.label}>اسم المنتج</Text>
    <TextInput value={name} onChangeText={setName} style={styles.input} placeholderTextColor={MUTED}/>

    <Text style={styles.label}>السعر المعروض (د.ع)</Text>
    <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} placeholderTextColor={MUTED}/>

    <Text style={styles.label}>الحالة</Text>
    <View style={styles.pillsRow}><Pill active>جديد</Pill><Pill>مستعمل</Pill></View>

    <Pressable style={styles.primaryWide} onPress={()=>go('result',{name,price:Number(price)||0,average:900000})}>
      <Text style={styles.primaryBtnText}>قيّم السعر الآن</Text>
    </Pressable>
  </ScrollView>
}

function Result({go, product}){
  const p = product || products[0];
  const price = Number(p.price)||0;
  const avg = Number(p.average)||900000;
  const diff = Math.round((avg-price)/avg*100);
  const good = diff >= 3;
  return <ScrollView contentContainerStyle={styles.content}>
    <Pressable onPress={()=>go('evaluate')}><Text style={styles.back}>→ تعديل التقييم</Text></Pressable>
    <Text style={styles.pageTitle}>نتيجة التقييم</Text>
    <View style={styles.resultCard}>
      <Text style={styles.resultProduct}>{p.name}</Text>
      <Text style={styles.muted}>السعر المعروض</Text>
      <Text style={styles.bigPrice}>{money(price)}</Text>
      <View style={styles.goodBox}>
        <Text style={styles.goodTitle}>{good ? '✓ السعر جيد' : '⚠ السعر مرتفع'}</Text>
        <Text style={styles.goodText}>{good ? `أقل من السعر المتوسط بنحو ${diff}%` : `أعلى من السعر المتوسط بنحو ${Math.abs(diff)}%`}</Text>
      </View>
      <Text style={styles.label}>السعر المناسب لهذا المنتج</Text>
      <Text style={styles.range}>{money(avg*0.90)} — {money(avg*1.02)}</Text>
    </View>

    <Text style={styles.sectionTitle}>نصائح قبل الشراء</Text>
    {['تأكد من عدم وجود خدوش أو كسور كبيرة','افحص الكاميرا والشاشة وجميع الأزرار','تحقق من البطارية والملحقات','تأكد من الرقم التسلسلي وIMEI'].map(x=>
      <View key={x} style={styles.checkRow}><Text style={styles.check}>✓</Text><Text style={styles.checkText}>{x}</Text></View>
    )}

    <Pressable style={styles.primaryWide} onPress={()=>go('compare')}><Text style={styles.primaryBtnText}>مقارنة العروض</Text></Pressable>
  </ScrollView>
}

function Compare({go}){
  return <ScrollView contentContainerStyle={styles.content}>
    <Pressable onPress={()=>go('home')}><Text style={styles.back}>→ الرئيسية</Text></Pressable>
    <Text style={styles.pageTitle}>مقارنة العروض</Text>
    <Text style={styles.subtitle}>اختر أفضل سعر من مصادر متعددة.</Text>
    {products.map((p,i)=><View key={p.name} style={styles.offer}>
      <View style={styles.productIcon}><Text style={{fontSize:22}}>▣</Text></View>
      <View style={{flex:1}}><Text style={styles.productName}>{p.name}</Text><Text style={styles.muted}>{['متجر زين','أمـزون','جوهـرا','السوق المفتوح'][i]}</Text></View>
      <View style={{alignItems:'flex-end'}}><Text style={styles.price}>{money(p.price)}</Text><Text style={styles.stars}>★ 4.{i+1}</Text></View>
    </View>)}
  </ScrollView>
}

function Favorites({go}){
  return <ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.pageTitle}>المفضلة</Text>
    <Text style={styles.subtitle}>المنتجات والعروض التي تريد متابعتها.</Text>
    {products.slice(0,3).map(p=><View key={p.name} style={styles.productCard}><View style={styles.productIcon}><Text style={{fontSize:22}}>♥</Text></View><View style={{flex:1}}><Text style={styles.productName}>{p.name}</Text><Text style={styles.muted}>آخر سعر: {money(p.price)}</Text></View><Text style={styles.green}>♡</Text></View>)}
  </ScrollView>
}

function Profile({go}){
  return <ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.pageTitle}>حسابي</Text>
    <View style={styles.profileCard}><View style={styles.avatar}><Text style={{fontSize:25}}>أ</Text></View><View><Text style={styles.productName}>مرحبًا بك 👋</Text><Text style={styles.muted}>حساب مجاني</Text></View></View>
    {['الإشعارات','إعدادات الحساب','المساعدة والدعم','عن يسوى'].map(x=><Pressable key={x} style={styles.setting}><Text style={styles.productName}>{x}</Text><Text style={styles.muted}>‹</Text></Pressable>)}
    <View style={styles.pro}><Text style={styles.proTitle}>يسوى Pro</Text><Text style={styles.proText}>تقييمات غير محدودة + إزالة الإعلانات + تنبيهات الأسعار.</Text><Pressable style={styles.primaryWide} onPress={()=>Alert.alert('قريبًا','سنضيف الاشتراك في المرحلة التالية.') }><Text style={styles.primaryBtnText}>الترقية قريبًا</Text></Pressable></View>
  </ScrollView>
}

export default function App(){
  const [screen,setScreen]=useState('home');
  const [selected,setSelected]=useState(products[0]);
  const go=(s,p)=>{
    if(p) setSelected(p);
    setScreen(s);
  };
  const content = useMemo(()=>{
    if(screen==='home') return <Home go={go}/>;
    if(screen==='evaluate') return <Evaluate go={go}/>;
    if(screen==='result') return <Result go={go} product={selected}/>;
    if(screen==='compare') return <Compare go={go}/>;
    if(screen==='favorites') return <Favorites go={go}/>;
    return <Profile go={go}/>;
  },[screen,selected]);

  return <SafeAreaView style={styles.app}>
    <StatusBar style="light"/>
    {content}
    <View style={styles.tabBar}>
      <Tab label="الرئيسية" icon="⌂" active={screen==='home'} onPress={()=>go('home')}/>
      <Tab label="المقارنة" icon="⇄" active={screen==='compare'} onPress={()=>go('compare')}/>
      <Tab label="المفضلة" icon="♡" active={screen==='favorites'} onPress={()=>go('favorites')}/>
      <Tab label="حسابي" icon="◯" active={screen==='profile'} onPress={()=>go('profile')}/>
    </View>
  </SafeAreaView>
}

function Tab({label,icon,active,onPress}){
  return <Pressable onPress={onPress} style={styles.tab}><Text style={[styles.tabIcon,active&&styles.active]}>{icon}</Text><Text style={[styles.tabText,active&&styles.active]}>{label}</Text></Pressable>
}

const styles=StyleSheet.create({
  app:{flex:1,backgroundColor:DARK},
  content:{padding:20,paddingBottom:110,gap:12},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10},
  logoRow:{flexDirection:'row',alignItems:'center',gap:8},
  logoMark:{width:40,height:40,borderRadius:13,backgroundColor:GREEN,alignItems:'center',justifyContent:'center',transform:[{rotate:'-8deg'}]},
  logoCheck:{fontSize:27,fontWeight:'900',color:DARK},
  logoText:{fontSize:30,fontWeight:'900',color:WHITE},
  bell:{color:GREEN,fontSize:18},
  title:{fontSize:32,fontWeight:'900',color:WHITE,lineHeight:40,marginTop:8},
  subtitle:{fontSize:15,color:MUTED,lineHeight:24},
  search:{height:52,borderRadius:17,backgroundColor:CARD,borderWidth:1,borderColor:'#17352B',flexDirection:'row',alignItems:'center',paddingHorizontal:14},
  searchIcon:{fontSize:25,color:MUTED},
  searchInput:{flex:1,color:WHITE,fontSize:15,textAlign:'right'},
  hero:{backgroundColor:'#0C3327',borderRadius:24,padding:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:6},
  heroTitle:{fontSize:21,fontWeight:'800',color:WHITE},
  heroText:{color:'#B9CEC7',marginTop:4,marginBottom:14},
  heroTag:{fontSize:75,color:GREEN,fontWeight:'900'},
  primaryBtn:{backgroundColor:GREEN,paddingVertical:11,paddingHorizontal:15,borderRadius:13,alignSelf:'flex-start'},
  primaryBtnText:{color:DARK,fontWeight:'900',fontSize:15},
  sectionTitle:{fontSize:19,fontWeight:'800',color:WHITE,marginTop:8},
  rowBetween:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  link:{color:GREEN,fontWeight:'800'},
  pill:{paddingHorizontal:17,paddingVertical:10,borderRadius:22,backgroundColor:CARD,borderWidth:1,borderColor:'#17352B'},
  pillActive:{backgroundColor:GREEN,borderColor:GREEN},
  pillText:{color:'#B7C8C2',fontWeight:'700'},
  pillTextActive:{color:DARK},
  pillsRow:{flexDirection:'row',gap:10},
  productCard:{backgroundColor:CARD,borderRadius:18,padding:13,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:'#143129'},
  productIcon:{width:48,height:48,borderRadius:14,backgroundColor:'#18372E',alignItems:'center',justifyContent:'center'},
  productName:{color:WHITE,fontWeight:'800',fontSize:15},
  muted:{color:MUTED,fontSize:12,marginTop:4},
  price:{color:WHITE,fontWeight:'900',fontSize:14},
  goodSmall:{color:GREEN,fontSize:11,marginTop:4,fontWeight:'800'},
  pageTitle:{fontSize:29,fontWeight:'900',color:WHITE,marginTop:8},
  back:{color:GREEN,fontWeight:'800',fontSize:14},
  cameraBox:{height:170,borderRadius:22,borderWidth:1,borderColor:'#1B4437',backgroundColor:CARD,alignItems:'center',justifyContent:'center',gap:8,marginTop:8},
  cameraIcon:{fontSize:44,color:GREEN},
  cameraTitle:{color:WHITE,fontSize:17,fontWeight:'800'},
  label:{color:'#C5D5D0',fontWeight:'700',marginTop:8},
  input:{height:52,borderRadius:15,backgroundColor:CARD,borderWidth:1,borderColor:'#17352B',color:WHITE,paddingHorizontal:15,fontSize:16,textAlign:'right'},
  primaryWide:{backgroundColor:GREEN,minHeight:52,borderRadius:16,alignItems:'center',justifyContent:'center',marginTop:12},
  resultCard:{backgroundColor:CARD,borderRadius:23,padding:20,borderWidth:1,borderColor:'#17382E',marginTop:8},
  resultProduct:{color:WHITE,fontSize:20,fontWeight:'900'},
  bigPrice:{color:WHITE,fontSize:32,fontWeight:'900',marginVertical:5},
  goodBox:{backgroundColor:'#0C3A2A',borderRadius:15,padding:15,marginVertical:12},
  goodTitle:{color:GREEN,fontWeight:'900',fontSize:18},
  goodText:{color:'#BBD4CB',marginTop:4},
  range:{color:GREEN,fontSize:18,fontWeight:'900'},
  checkRow:{flexDirection:'row',alignItems:'center',gap:10,paddingVertical:7},
  check:{color:GREEN,fontSize:20,fontWeight:'900'},
  checkText:{color:'#D6E3DF',flex:1},
  offer:{backgroundColor:CARD,borderRadius:18,padding:13,flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:'#143129'},
  stars:{color:'#E3B94C',fontSize:11,marginTop:4},
  green:{color:GREEN,fontSize:25},
  profileCard:{backgroundColor:CARD,borderRadius:20,padding:18,flexDirection:'row',alignItems:'center',gap:14},
  avatar:{width:54,height:54,borderRadius:27,backgroundColor:GREEN,alignItems:'center',justifyContent:'center'},
  setting:{backgroundColor:CARD,borderRadius:15,padding:17,flexDirection:'row',justifyContent:'space-between'},
  pro:{backgroundColor:'#0B3328',borderRadius:20,padding:18,marginTop:8},
  proTitle:{color:GREEN,fontSize:22,fontWeight:'900'},
  proText:{color:'#C1D3CC',lineHeight:22,marginTop:5},
  tabBar:{position:'absolute',bottom:0,left:0,right:0,height:76,backgroundColor:'#081A15',borderTopWidth:1,borderTopColor:'#153329',flexDirection:'row',justifyContent:'space-around',alignItems:'center',paddingBottom:5},
  tab:{alignItems:'center',justifyContent:'center',minWidth:70,gap:3},
  tabIcon:{color:'#789089',fontSize:23},
  tabText:{color:'#789089',fontSize:11,fontWeight:'700'},
  active:{color:GREEN}
});
