<script lang="ts">
	import { goto } from "$app/navigation";
	import { supabase, uploadToCloudinary } from "$lib/helper";
	import { registerSchema } from "$lib/schemas/registerSchemas";
	import { pageTitle } from "$lib/stores/title";
	import { onMount } from "svelte";

    let nickName = $state('');
    let fullName = $state('');
    let gender = $state('');
    let birthdate = $state('');
    let phoneNumber = $state('');
    let medicalInfo = $state('');
    let fitnessGoal = $state('');
    let preferedWorkoutTime = $state('');
    let photo : File |null = $state(null);
    let message = $state('');
    let loadingCloudinary = $state(false);
    let loadingSupabase = $state(false);
    let photoUrl: string | null = $state(null) 
    let paymentMethod = $state('')
    
    async function handleSubmit() {
        const formData = {
            nick_name: nickName,
            full_name: fullName,
            gender: gender,
            birth_date: birthdate,
            phone_number: phoneNumber,
            medical_info: medicalInfo,
            fitness_goal: fitnessGoal,
            prefered_workout_time: preferedWorkoutTime,
        }

        const parsed = registerSchema.safeParse(formData)
        if (!parsed.success) {
            message = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
            console.log(message)
            return
        }
        if (!photo) {
            message = 'please upload a photo before submitting'
            console.log(message)
            return;
        }
        loadingCloudinary = true;
        loadingSupabase = true
        message = 'Uploading Photo'

        try {
            const uploadRes = await uploadToCloudinary(photo)
            photoUrl = uploadRes.secure_url;

        } catch(err) {
            message = 'image upload fail'
            return;
        } 
        finally {
            loadingCloudinary = false
        }
        if (!photoUrl) return;

        const finalData = {...parsed.data, photo_url: photoUrl}
        console.log(finalData)
        const { data: member, error: memberError } = await supabase.from('Members').insert([
            finalData
        ]).select().single()


        if(memberError || !member) {
            console.log(memberError)
            message= "Member's data upload fail"
            return
        } else {
            console.log(member, memberError)

            const newMemberId = member.member_id;
            const transactionId = `${new Date().toISOString().split("T")[0].replaceAll("-","")}-${newMemberId}`;

            const transactionPayLoad = {
                transaction_id:transactionId,
                member_id: newMemberId,
                membership_types_id: 1,
                transaction_type:"signup",
                amount: 100,
                payment_method: paymentMethod,
                transaction_date: `${new Date().toISOString().split("T")[0]}`,                
            }
            
            const { data: trx, error:trxError } = await supabase.from('Transactions').insert(
                transactionPayLoad
            ).select().single()

            if(trxError || !trx){
                console.log(trxError)
                return
            } else {
                message= "Success!"
                alert(message)
                setTimeout(() =>{
                    goto('/dashboard/success')
                }, 1000)
                loadingSupabase=false
            }
        }

    }
    let step = $state(2);
    const totalStep = 3;

    function nextStep(){
        if (step<totalStep) step++
    }
    function prevStep(){
        if (step>1) step--
    }
    onMount(() => {
        pageTitle.set('REGISTER')
    })
</script>

<div class="flex items-center justify-between mb-6">
    {#each [1,2,3] as s}
    <div class="flex-1 text-center">
        <div class="h-2 rounded-full mx-2 bg-gray-400"
            class:bg-green-500={step >= s}></div>
        <span class="text-sm"
            class:font-bold={step >= s}>
            {s === 1? 'Personal' : s === 2 ? 'Technical' : 'other'}
        </span>
    </div> 
    {/each}
</div>
<div class="w-full">
<form onsubmit={handleSubmit} class="flex flex-col gap-5 mx-auto ">
    <label for="profil">Display Picture</label>
    <input type="file" accept="image/*" id="profil">
    <div class="form-field">
        <label for="fullname">Full Name</label>
        <input type="text" id="fullname"  bind:value={fullName} placeholder="Joni Jumawan" required>
    </div> 
    
    <div class="form-field-group gap-5 justify-center">
        <div class="form-field">
            <label for="nickname">Nickname</label>
            <input class="" type="text"  id="nickname" bind:value={nickName} placeholder="Joni" required>
        </div>
        <div class="form-field">
            <label  for="birthdate">Birth Date</label>
            <input class="text-black" type="date" id="birthdate" bind:value={birthdate} required>
        </div>
    </div>
        <div >
            <div class="form-field">
                <label for="phonenumber">Phone Number</label>
                <input class="text-black" type="tel" id="phonenumber" bind:value={phoneNumber} placeholder="+6287722479025"  required>
            </div>
            <div >
                <div class="form-field">
                    <label>
                        <input type="radio" id="gender" value="male" bind:group={gender}/>Male
                    </label>
                    <label>
                        <input type="radio" id="gender" value="female" bind:group={gender}/>Female
                    </label>
                </div>
            </div>
        </div>
    <div >
        <div >
            <input type="text" id="medicalinfo" bind:value={medicalInfo} placeholder="Sehat" required>
        </div>
        <div >
            <input type="text" id="fitnessgoal" bind:value={fitnessGoal} placeholder="Brotot" required>
        </div>
    </div>


    <div >
        <div >
            <label for="paymentmethod">Payment Method</label>
            <input type="text" id="paymentmethod" bind:value={paymentMethod} placeholder="Cash" required>
        </div>
        <div >
            <label for="workouttime">Prefered Workout Time</label>
            <input type="text" id="workouttime" bind:value={preferedWorkoutTime} placeholder="Morning" required>
        </div>
    </div>


    
    <div ><button  type="submit">Submit</button></div>
</form>
    
</div>

<style global>
    .form-field {
        @apply flex flex-col w-4/5 align-middle;
    }
    .form-field-group {
        @apply flex;
    }
</style>